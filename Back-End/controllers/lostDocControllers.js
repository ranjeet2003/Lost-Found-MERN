const { validationResult } = require("express-validator");
const crypto = require("crypto");
const FoundDocument = require("../models/foundDocument");

const HttpError = require("../util/http-error");

const Document = require("../models/lostDocument");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

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
  // console.log(req.user);
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
    // logger: (m) => console.log(m),
  })
    .then(({ data: { text } }) => {
      // console.log(text);
      // docs: createdDoc.toObject({ getters: true });

      // ocrData = text;
      const hash = crypto.createHash("sha256").update(text).digest("base64");
      // { docs: createdDoc.toObject({ getters: true }) }
      // console.log(hash);
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
              const error = new HttpError(
                "Your document did not found on database, Please try after some time.",
                401
              );
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
              lupoadedBy: req.user.name,
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

exports.lostInfo = lostInfo;
exports.upload = upload;
