const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Document = require("../models/lostDocument");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const tesseract = require("node-tesseract-ocr");
// var tesseract1 = require("node-tesseract");
// import Tesseract from "tesseract.js";
const Tesseract = require("tesseract.js");

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

  // const imageName = temp1 + createdDoc.image;
  const imageName = temp1 + req.file.filename;

  Tesseract.recognize(imageName, "eng", {
    logger: (m) => console.log(m),
  })
    .then(({ data: { text } }) => {
      // console.log(text);
      // docs: createdDoc.toObject({ getters: true });

      ocrData = text;

      // { docs: createdDoc.toObject({ getters: true }) }
    })
    .then(() => {
      // console.log(ocrData);
      const createdDoc = new Document({
        name: obj.name,
        description: obj.description,
        serial: obj.serial,
        image: req.file.filename,
        text: ocrData,
      });
      createdDoc.save();
      res.status(201).json({ docs: createdDoc.toObject({ getters: true }) });
    })
    .catch((err) => {
      const error = new HttpError("Doc Upload Failed, please try again.", 500);
      return next(error);
    });

  // docs: createdDoc.toObject({ getters: true })
  // res.status(201).json({ docs: createdDoc.toObject({ getters: true }) });
  // Code for OCR

  // console.log(imageName);
};

exports.lostInfo = lostInfo;
exports.upload = upload;
