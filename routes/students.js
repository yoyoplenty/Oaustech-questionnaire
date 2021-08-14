const express = require("express"),
	router = express.Router(),
	studentController = require("../controllers/student");

router.get("/signup", studentController.getRegistrationForm);
router.get("/login", studentController.getLoginForm);
router.get("/dashboard", studentController.getdashboard);
router.get("/first-semester", studentController.firstsemester);
router.get("/second-semester", studentController.secondsemester);
router.get("/question/:course", studentController.getEachCourseQuestion);
router.post("/login", studentController.signin);
router.post("/signup", studentController.signup);

module.exports = router;
