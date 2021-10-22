const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../util/catchAsync");
const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const User = require("../models/user");
const AppError = require("./../util/appError");
// const Email = require("../util/email");
const sendEmail = require("../util/email");
const sgMail = require("@sendgrid/mail");
const { CourierClient } = require("@trycourier/courier");

require("dotenv").config({ path: "./config.env" });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// const client = require("twilio")(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

sgMail.setApiKey(
  "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"
);

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
  // res.redirect("http://localhost:3000");
  // .redirect("/");
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.totalUser = async (req, res, next) => {
  let num;
  try {
    num = await User.countDocuments();
    // console.log(num);
  } catch (err) {
    const error = new HttpError(
      "Counting users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).json({ status: true, totalUser: num });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
  });

  const message = "Thanks User for signup";

  const courier = CourierClient({
    authorizationToken: process.env.COURIER_AUTH_TOKEN,
  });

  // const { messageId } = await courier.send({
  courier
    .send({
      eventId: "personalized-welcome-email",
      recipientId: process.env.COURIER_RECIPIENT_ID,
      data: {
        firstname: req.body.name,
        favoriteAdjective: "Thank You",
      },
      profile: {
        email: req.body.email,
      },
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch((err) => {
      console.log(err);
    });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "You have been successfully logged out !",
  });
};

exports.sendOTP = (req, res, next) => {
  const { mobile } = req.body;
  client.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verifications.create({
      to: mobile,
      channel: "sms",
    })
    .then((data) => {
      res.status(200).json({ status: true, resData: data });
    });
};

exports.validateOTP = (req, res, next) => {
  const { mobile, otp } = req.body;
  if (req.body.mobile && req.body.otp.length === 4) {
    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: mobile,
        code: otp,
      })
      .then((data) => {
        if (data.status === "approved") {
          res.status(200).json({ status: true, resData: data });
        } else {
          res.status(400).json({ status: false, resData: data });
        }
      });
  } else {
    res.status(400).json({ status: false, resData: data });
  }
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

exports.getUsers = getUsers;
