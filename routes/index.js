const express = require("express"),
	router = express.Router(),
	indexController = require("../controllers/index");

/**
 * GET REQUEST
 */
router.get("/", indexController.gethomepage);
router.get("/register", indexController.getRegistrationForm);
// router.get("/login", indexController.getLoginForm);
router.get("/age", indexController.age);

/**
 * POST REQUEST
 */
// router.post("/register", indexController.signup);
// router.post("/login", indexController.signin);

module.exports = router;
