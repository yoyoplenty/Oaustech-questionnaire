const Course = require("../models/courses");

exports.createCourseForm = async (req, res) => {
	res.render("admin/addcourses");
};
exports.createCourse = async (req, res) => {
	// res.render("addquestion");
	let { level, courseName, courseCode, program } = req.body;

	if (!courseName || !level || !courseCode) {
		return res.render("admin/addcourses", {
			error: "incomplete details",
		});
	}

	let course = await Course.findOne({
		$and: [
			{ courseCode: courseCode },
			{ level: level },
			{ courseName: courseName },
		],
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
		program,
	});

	console.log(newcourse);
	newcourse
		.save()
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
		});
};

exports.delete = async (req, res) => {
	try {
		await Course.findOneAndDelete({ _id: req.params.id }).exec();

		res.send("course deleted");
	} catch (error) {}
};

exports.getcourseForm = async (req, res) => {
	try {
		console.log("djnjn");

		res.render("admin/selectdetailsform");
	} catch (error) {}
};

exports.getCourse = async (req, res) => {
	try {
		console.log(req.query);

		const courses = await Course.find({
			$and: [{ program: req.query.program }, { level: req.query.level }],
		});

		console.log(courses);
		let semester;
		if (req.query.semester == "1") {
			semester = courses.filter(function (element) {
				return element.courseCode.charAt("2") % 2 !== 1;
			});
		} else {
			semester = courses.filter(function (element) {
				return element.courseCode.charAt("2") % 2 !== 0;
			});
		}
		console.log(semester);

		res.render("admin/viewallcourses", { semester });
	} catch (error) {}
};
