const express = require("express"),
	router = express.Router(),
	course = require("../controllers/course");

router.get("/", course.createCourseForm);
router.post("/", course.createCourse);
router.delete("/", course.delete);

module.exports = router;
