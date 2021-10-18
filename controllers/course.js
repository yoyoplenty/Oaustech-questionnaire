const Course = require("../models/courses");

exports.createCourseForm = async (req, res) => {
	res.render("admin/addcourses");
};
exports.createCourse = async (req, res) => {
	// res.render("addquestion");
	let { level, courseName, courseCode, program } = req.body

	console.log(req.body)
	let theLevel = level.charAt("0")
	let theCode = courseCode.charAt("0")
	let theLength = courseCode.length

	if (theLevel !== theCode) {
		return res.render("admin/addcourses", {
			error: "Course Code doesn't match selected Level",
		});
	}
	if (theLength !== 3) {
		return res.render("admin/addcourses", {
			error: "invalid Course Code",
		});
	}

	if (!courseName || !program || !level || !courseCode || isNaN(level)) {
		return res.render("admin/addcourses", {
			error: "incomplete details",
		});
	}


	let course = await Course.findOne({
		$and: [
			{ courseCode: courseCode },
			{ level: level },
			{ program: program },
			{ courseName: courseName }],
	});


	if (course) {
		return res.render("admin/addcourses", {
			message: "course already exists",
		});
	}

	let newcourse = new Course({
		courseName,
		courseCode,
		level,
		program
	});
	console.log(newcourse)
	newcourse.save()
		.then((course) => {
			if (!course) {
				return res.render("admin/addcourses", {
					message: "unable to create course",
				});
			} else {
				res.render("admin/addcourses", {
					message: "course added successfully",
				});
			}
		})
		.catch((err) => {
			console.log(err);
		})

};
exports.getAllCourse = async (req, res) => {
	try {
		let allCourse = await Course.find({})
		allCourse.sort((a, b) => a.courseCode - b.courseCode)
		res.render('admin/allcourses', {
			courses: allCourse
		})
	} catch (error) { }
};
exports.getEditCourse = async (req, res) => {
	try {
		let ID = req.params.id
		console.log(ID)
		let exactCourse = await Course.findById(ID)
		//	console.log(exactCourse)
		res.render('admin/editcourse', {
			course: exactCourse
		})
	} catch (error) { }
}
exports.editCourse = async (req, res) => {
	try {
		let { level, courseName, courseCode } = req.body;

		let ID = req.params.id

		//setting the specific course to a variable 
		req.course = await Course.findById(ID);
		let courses = req.course;


		//check if it was not updated
		if (!courseName || !level || !courseCode || isNaN(level)) {
			req.flash("error", "Incomplete details");
			return res.redirect(`/course/edit/${ID}`)
		};

		if (courseName === courses.courseName &&
			courseCode == courses.courseCode || level === courses.level) {
			req.flash("error", "Nothing was updated");
			return res.redirect(`/course/edit/${ID}`)
		}



		//set the previous course to the new one
		courses.courseName = courseName
		courses.courseCode = courseCode
		courses.level = level

		//get it saved
		newCourse = await courses.save()
		if (newCourse) {
			req.flash(`success`, `Course was updated successfully`)
			res.redirect('/course/all')
		} else {
			req.flash("error", "Please Nothing was updated");
			return res.redirect(`/course/edit/${ID}`)
		}
	} catch (error) { }
};
exports.deleteCourse = async (req, res) => {
	try {
		let ID = req.params.id
		await Course.findOneAndDelete(ID).exec();
		req.flash(`success`, `Course was deleted successfully`)
		res.redirect('/course/all')
	} catch (error) { }
};
