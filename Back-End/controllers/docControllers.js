const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Document = require("../models/document");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/AllDocs");
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

  var obj = {
    name: req.body.name,
    description: req.body.description,
    serial: req.body.serial,
    img: {
      data: fs.readFileSync(path.join("public/AllDocs/" + req.file.filename)),
      contentType: "image/png",
    },
  };
  //   console.log(req.file);
  //   console.log(obj);

  const createdDoc = new Document({
    name: obj.name,
    description: obj.description,
    serial: obj.serial,
    // image: obj.img.filename,
    // img: obj.file,
    // image: "abc.jpg",
    image: req.file.filename,
    isLost: true,
  });

  try {
    // console.log(createdDoc);
    await createdDoc.save();
    // console.log("Document saved to db");
  } catch (err) {
    const error = new HttpError("Doc Upload Failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ docs: createdDoc.toObject({ getters: true }) });
};

exports.lostInfo = lostInfo;
exports.upload = upload;
