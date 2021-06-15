const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
// const getCoordsForAddress = require('../util/location');
const Document = require("../models/lostDocument");
const User = require("../models/user");

const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({});
    console.log(documents);
    return res.status(201).json({ documents });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find documents.",
      500
    );
    return next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  const docId = req.params.did;

  let doc;
  try {
    doc = await Document.findById(docId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a document.",
      500
    );
    return next(error);
  }

  if (!doc) {
    const error = new HttpError(
      "Could not find a document for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ document: doc.toObject({ getters: true }) });
};

// const getPlacesByUserId = async (req, res, next) => {
//   const userId = req.params.uid;

//   // let places;
//   let userWithPlaces;
//   try {
//     userWithPlaces = await User.findById(userId).populate('places');
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching places failed, please try again later',
//       500
//     );
//     return next(error);
//   }

//   // if (!places || places.length === 0) {
//   if (!userWithPlaces || userWithPlaces.places.length === 0) {
//     return next(
//       new HttpError('Could not find places for the provided user id.', 404)
//     );
//   }

//   res.json({
//     places: userWithPlaces.places.map(place =>
//       place.toObject({ getters: true })
//     )
//   });
// };

const createDocument = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, serial, description, image, isLost } = req.body;

  // let user;
  // try {
  //   user = await User.findById(userId);
  // } catch (err) {
  //   const error = new HttpError('Creating place failed, please try again', 500);
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError('Could not find user for provided id', 404);
  //   return next(error);
  // }

  const createdDocument = new Document({
    name,
    serial,
    description,
    image,
    isLost,
  });

  console.log(createdDocument);

  // try {
  //   const sess = await mongoose.startSession();
  //   sess.startTransaction();
  //   await createdDocument.save({ session: sess });
  //   user.places.push(createdPlace);
  //   await user.save({ session: sess });
  //   await sess.commitTransaction();
  // } catch (err) {
  //   const error = new HttpError(
  //     'Creating place failed, please try again.',
  //     500
  //   );
  //   return next(error);
  // }

  const savedDocument = await createdDocument.save();

  res.status(201).json({ document: savedDocument });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getDocuments = getDocuments;
exports.getDocumentById = getDocumentById;
// exports.getPlacesByUserId = getPlacesByUserId;
exports.createDocument = createDocument;
// exports.updatePlace = updatePlace;
// exports.deletePlace = deletePlace;
