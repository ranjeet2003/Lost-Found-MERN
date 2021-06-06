const express = require('express');
const { check } = require('express-validator');

const documentControllers = require('../controllers/document-controllers');

const router = express.Router();

router.get('/', documentControllers.getDocuments);
router.get('/:did', documentControllers.getDocumentById);

// router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/', documentControllers.createDocument);

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

module.exports = router;
