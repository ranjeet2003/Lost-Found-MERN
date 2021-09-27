const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

// router.get("/", usersController.getUsers);

router.post("/signup", usersController.signup);
router.post("/login", usersController.login);
router.get("/logout", usersController.logout);
router.get("/numUser", usersController.totalUser);
router.post("/sendOTP", usersController.sendOTP);
router.post("/validateOTP", usersController.validateOTP);

// Protect all routes after this middleware
// All routes are protected after this middleware.
// User need to be logged in before accessing this route
router.use(usersController.protect);

router.patch("/updateMyPassword", usersController.updatePassword);
// router.get("/numUser", usersController.getUsersNum);

module.exports = router;
