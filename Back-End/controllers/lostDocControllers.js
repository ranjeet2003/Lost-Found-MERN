require("dotenv").config();
const crypto = require("crypto");
const FoundDocument = require("../models/foundDocument");
const HttpError = require("../util/http-error");
const Document = require("../models/lostDocument");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const log = console.log;
const sendEmail = require("../util/email");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = "ACe112366ab0e12c477bf218ffaffcce71";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const authToken = "992bda44a1eb424833f92d04311bc8c3";
const client = require("twilio")(accountSid, authToken);

const auth = {
  auth: {
    api_key: "a96793575b8e5586b43683ddc7c4e6d2-65b08458-2acc0862",
    domain: "lost-found.team",
  },
};

let transporter = nodemailer.createTransport(mailGun(auth));

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/LostUpload");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new HttpError("Not an image, please upload an image.", 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadDocs = upload.single("img");

const lostInfo = async (req, res, next) => {
  //   console.log(typeof req.file.filename);
  // console.log(req.user);
  // let mailOptions = {
  //   from: "ranjeetgautam13032@gmail.com", // TODO: email sender
  //   to: req.user.email, // TODO: email receiver
  //   subject: "Nodemailer - Test",
  //   text: "Wooohooo it works!!",
  // };
  var obj = {
    name: req.body.name,
    description: req.body.description,
    serial: req.body.serial,
    image: {
      data: fs.readFileSync(
        path.join("public/LostUpload/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  //   console.log(req.file);
  //   console.log(obj);
  let ocrData = "";
  let reqPath = path.join(__dirname, "../");
  let temp = path.join(reqPath, "public");
  let temp1 = path.join(temp, "LostUpload");
  temp1 = temp1 + "\\";
  const imageName = temp1 + req.file.filename;

  Tesseract.recognize(imageName, "eng", {
    logger: (m) => console.log(m),
  })
    .then(({ data: { text } }) => {
      const hash = crypto.createHash("sha256").update(text).digest("base64");
      ocrData = hash;
    })
    .then(() => {
      // console.log(ocrData);
      let isDocMatched = false;
      let MatchedCurser = FoundDocument.findOne({ encText: ocrData }).exec(
        (err, data) => {
          if (err) console.log(err);
          else {
            // console.log(data);
            if (!data) {
              isDocMatched = false;
            } else if (data.encText === ocrData) {
              isDocMatched = true;
            }

            if (isDocMatched) {
              const message = `Your lost document has already been uploaded by ${req.user.name}.\nKindly contact
              the mobile no ${req.user.mobile} and email ${req.user.email} to get back your document.`;

              sendEmail({
                email: req.user.email,
                subject: "Update on your document upload",
                message,
              })
                .then(() => {
                  console.log("Email delivered successfully");
                })
                .catch((err) => {
                  console.log(err);
                });
            }

            // if (isDocMatched) {
            // transporter.sendMail(mailOptions, (err, data) => {
            //   if (err) {
            //     return log("Error occurs");
            //   }
            //   return log("Email sent!!!" + data);
            // });
            // }

            // if (isDocMatched) {
            // client.messages
            //   .create({
            //     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
            //     from: "+12036897715",
            //     // to: "+91" + req.user.mobile,
            //     to: "+919506717537",
            //   })
            //   .then((message) => console.log(message.sid));
            // }

            const createdDoc = new Document({
              name: obj.name,
              description: obj.description,
              serial: obj.serial,
              image: req.file.filename,
              encText: ocrData,
              isMatched: isDocMatched,
              uploadedBy: req.user.name,
              userEmail: req.user.email,
              userMobileNo: req.user.mobile,
            });
            createdDoc.save();

            res
              .status(201)
              .json({ docs: createdDoc.toObject({ getters: true }) });
            console.log("Document mached: " + isDocMatched);
          }
        }
      );
    })
    .catch((err) => {
      const error = new HttpError("Doc Upload Failed, please try again.", 500);
      return next(error);
    });
};

exports.lostInfo = lostInfo;
exports.upload = upload;
