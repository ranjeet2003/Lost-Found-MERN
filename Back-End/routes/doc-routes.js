const express = require("express");
const { check } = require("express-validator");

const documentControllers = require("../controllers/document-controllers");
const docControllers = require("../controllers/docControllers");

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

router.post("/lostDocs", docControllers.uploadDocs, docControllers.lostInfo);

module.exports = router;
