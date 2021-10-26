const express = require("express");

const lostDocControllers = require("../controllers/lostDocControllers");
const foundDocController = require("../controllers/foundDocControllers");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post(
  "/lostDocs",
  usersController.protect,
  lostDocControllers.uploadDocs,
  lostDocControllers.lostInfo
);

router.post(
  "/foundDocs",
  usersController.protect,
  foundDocController.uploadDocs,
  foundDocController.foundInfo
);

module.exports = router;
