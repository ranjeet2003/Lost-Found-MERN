const express = require("express");
const { check } = require("express-validator");

const documentControllers = require("../controllers/document-controllers");
const lostDocControllers = require("../controllers/lostDocControllers");
const foundDocController = require("../controllers/foundDocControllers");

const router = express.Router();

router.get("/", documentControllers.getDocuments);
router.get("/:did", documentControllers.getDocumentById);

// router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post("/", documentControllers.createDocument);

// router.patch(
//   '/:pid',
//   [
//     check('title')
//       .not()
//       .isEmpty(),
//     check('description').isLength({ min: 5 })
//   ],
//   placesControllers.updatePlace
// );

// router.delete('/:pid', placesControllers.deletePlace);

router.post(
  "/lostDocs",
  lostDocControllers.uploadDocs,
  lostDocControllers.lostInfo
);

router.post(
  "/foundDocs",
  foundDocController.uploadDocs,
  foundDocController.foundInfo
);

module.exports = router;
