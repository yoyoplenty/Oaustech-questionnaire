const express = require("express"),
	router = express.Router(),
	course = require("../controllers/course");

router.get("/", course.createCourseForm);
router.get("/all", course.getAllCourse);
router.get("/edit/:id", course.getEditCourse);
//update and delete courses
router.put("/:id", course.editCourse);
router.post("/", course.createCourse);
router.delete("/delete/:id", course.deleteCourse);

module.exports = router;
