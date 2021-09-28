const { validationResult } = require("express-validator");
var crypto = require("crypto");

const HttpError = require("../util/http-error");

const Document = require("../models/foundDocument");
const LostDocument = require("../models/lostDocument");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Tesseract = require("tesseract.js");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/FoundUpload");
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

const foundInfo = async (req, res, next) => {
  var obj = {
    name: req.body.name,
    description: req.body.description,
    serial: req.body.serial,
    image: {
      data: fs.readFileSync(
        path.join("public/FoundUpload/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  let ocrData = "";
  let reqPath = path.join(__dirname, "../");
  let temp = path.join(reqPath, "public");
  let temp1 = path.join(temp, "FoundUpload");
  temp1 = temp1 + "\\";
  const imageName = temp1 + req.file.filename;

  Tesseract.recognize(imageName, "eng", {
    // logger: (m) => console.log(m),
  })
    .then(({ data: { text } }) => {
      const hash = crypto.createHash("sha256").update(text).digest("base64");
      ocrData = hash;
    })
    .then(() => {
      let isDocMatched = false;

      let MatchedCurser = LostDocument.findOne({ encText: ocrData }).exec(
        (err, data) => {
          if (err) console.log(err);
          else {
            if (!data) {
              // const error = new HttpError(
              //   "Your uploaded document did not found on database, Please wait for other user to upload same document.",
              //   401
              // );
              isDocMatched = false;
              // return next(error);
            } else if (data.encText === ocrData) {
              isDocMatched = true;
            }
            const createdDoc = new Document({
              name: obj.name,
              description: obj.description,
              serial: obj.serial,
              image: req.file.filename,
              encText: ocrData,
              isMatched: isDocMatched,
              uploadedBy: req.user.name,
              userEmail: req.user.email,
              userMobilrNo: req.user.mobile,
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

exports.foundInfo = foundInfo;
exports.upload = upload;
