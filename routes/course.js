const express = require("express"),
	router = express.Router(),
	course = require("../controllers/course");
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../configure/auth');
//passport config
require('../configure/passport')(passport)

router.get("/", ensureAuthenticated, course.createCourseForm);
router.get("/select", course.getcourseForm);
router.get("/getcourse", course.getCourse)
router.get("/edit/:id", ensureAuthenticated, course.getEditCourse);
//update and delete courses
router.put("/:id", ensureAuthenticated, course.editCourse);
router.post("/", ensureAuthenticated, course.createCourse);
router.delete("/delete/:id", ensureAuthenticated, course.deleteCourse);

module.exports = router;
