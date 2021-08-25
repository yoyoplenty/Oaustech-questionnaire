const express = require("express"),
	router = express.Router(),
	course = require("../controllers/course");

router.get("/", course.createCourseForm);
router.get("/select", course.getcourseForm);
router.get("/getcourse", course.getCourse);
router.post("/", course.createCourse);
router.delete("/", course.delete);

module.exports = router;
