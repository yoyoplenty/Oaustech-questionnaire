const Result = require("../models/Results"),
	Student = require("../models/Students"),
	Courses = require("../models/courses"),
	Question = require("../models/question");

exports.saveResult = async (req, res) => {
	try {
		const student = req.session.user;
		const question = await Question.findOne({
			courseCode: req.params.course,
		});

		const answered = question.answered;

		/**
		 * Handles reanswering of questions
		 */
		if (answered.map((el) => el).includes(student.matricNo)) {
			return res.render("question", {
				err: "you cannot answer the second time",
			});
		}

		let result = Object.values(req.body);
		for (let i = 0; i < result.length; i++) {
			const s = await Question.findOne({ courseCode: req.params.course });
			console.log(`count${i}`);
			await Question.findOneAndUpdate(
				{ courseCode: req.params.course },
				{ $push: { answers: result[i] } },
				{ upsert: true, new: true }
			);
		}

		await Question.findOneAndUpdate(
			{ courseCode: req.params.course },
			{ $push: { answered: student.matricNo } },
			{ upsert: true, new: true }
		);
		res.render("studentdashboard", {
			success:
				"Answer submitted succesfully, please move to the next course",
			student,
		});
	} catch (error) {}
};

exports.createresult = async (req, res) => {
	try {
		console.log("result ==== ", req.body);
		//get student that posted
		let student = req.session.user;
		//get the course the student posted
		let course = req.session.course;

		//get the question to ensure proper selection of the response
		let question = await Question.find({});
		let questionLength = question.length;

		//this is to ensure a value is selected
		let thearray = Object.values(req.body);

		if (thearray.length < questionLength) {
			req.flash("error", `Please ensure to select an option`);
			return res.redirect(`/student/question/${course.course}`);
		}

		//ensure user did not exceed the number of question given a response
		let arrays = Object.values(req.body.option);

		if (questionLength != arrays.length || questionLength < arrays.length) {
			req.flash(
				"error",
				`Please ensure to select your best response, for each questions and respond to all questions`
			);
			return res.redirect(`/student/question/${course.course}`);
		}

		//this is to ensure a student dont give a response twice
		let courseClicked = await Result.findOne({
			$and: [{ matricNo: student.matricNo }, { course: course.course }],
		});

		if (courseClicked) {
			req.flash(
				"error",
				`Cannot submit course ${course.course}, You have given a response already`
			);
			return res.redirect(`/student/question/${course.course}`);
		}

		const result = new Result({
			course: course.course,
			matricNo: student.matricNo,
			program: student.program,
			option: req.body.option,
		});

		//save result to database
		result.save();

		if (!result) {
			req.flash("error", `Data did not save`);
			return res.redirect("/student/dashboard");
		}

		res.render("studentdashboard", {
			success:
				"Answer submitted succesfully, please move to the next course",
			student,
		});
	} catch (error) {}
};

exports.getresult = async (req, res) => {
	try {
		console.log("I am coming with the answers");
		console.log(req.body);

		let Course = await Courses.find({
			$and: [{ program: req.body.program }, { level: req.body.level }],
		});
		let semesterCourses;

		console.log("Course = ", Course);
		if (!Course) {
			return res.render("admin/programs", {
				error: "no course to display",
			});
		}
		console.log("repo");

		if (req.body.semester == 1) {
			semesterCourses = Course.filter(function (first) {
				return first.courseCode.charAt("2") % 2 !== 1;
			});
		} else if (req.body.semester == 2) {
			semesterCourses = Course.filter(function (first) {
				return first.courseCode.charAt("2") % 2 !== 0;
			});
		}
		console.log("trying");
		const totalNo = semesterCourses.length;
		console.log(totalNo);

		console.log("semesterCourses = ", semesterCourses);
		// //get all courses
		// console.log("PPPPPPPPPp");
		// let Course = await Courses.find({});
		// let totalNo = await Courses.find({}).countDocuments();
		// let allCourses = Course.slice(0);

		// //render the courses based on level

		// //to get 100 level course
		// let all100 = allCourses.filter(function (first) {
		// 	return first.courseCode.charAt("0") == 1;
		// });
		// //to get 200 level course
		// let all200 = allCourses.filter(function (first) {
		// 	return first.courseCode.charAt("0") == 2;
		// });
		// //to get 300 level course
		// let all300 = allCourses.filter(function (first) {
		// 	return first.courseCode.charAt("0") == 3;
		// });
		// //to get 400 level course
		// let all400 = allCourses.filter(function (first) {
		// 	return first.courseCode.charAt("0") == 4;
		// });
		// //to get 500 level course
		// let all500 = allCourses.filter(function (first) {
		// 	return first.courseCode.charAt("0") == 5;
		// });

		// //still want to render each courses in bootstrap row based on level
		// //dont want it to be hard coded
		// console.log(totalNo);
		res.render("admin/allcourse", {
			semesterCourses,
			totalNo,
		});
	} catch (error) {}
};
exports.geteachresult = async (req, res) => {
	try {
		console.log("ddmsksdkm");
		// let courses = req.params;
		//set session to particular course
		// req.session.course = courses;
		let questions = await Question.find(
			{ courseCode: req.params.course },
			{},
			{ lean: true }
		);
		console.log("QUESTIONS ==========", questions.length);

		// GET THE NUMBER OF EACH REPLY
		let stronglyAgree, agree, neutral, disagree, stronglyDisagree;

		let result = [];
		for (let i = 0; i < questions.length; i++) {
			// console.log("questions[i]", questions[i]);

			stronglyAgree = questions[i].answers.filter(function (answer) {
				return answer == "strongly agree";
			}).length;
			agree = questions[i].answers.filter(function (answer) {
				return answer == "agree";
			}).length;
			neutral = questions[i].answers.filter(function (answer) {
				return answer == "neutral";
			}).length;
			disagree = questions[i].answers.filter(function (answer) {
				return answer == "disagree";
			}).length;
			stronglyDisagree = questions[i].answers.filter(function (answer) {
				return answer == "strongly disagree";
			}).length;

			let answer = {
				stronglyAgree,
				agree,
				neutral,
				disagree,
				stronglyDisagree,
			};

			result.push(answer);
		}

		for (let count = 0; count < result.length; count++) {
			console.log(`questions[${count}]`, questions[count].answers);
			console.log("result   = ", result[count]);
			questions[count].answers = result[count];
			console.log();
			console.log("next");
		}

		res.render("admin/eachresult", {
			course: req.params.course,
			questions,
			result,
		});
		// }
	} catch (error) {}
};

exports.getprogram = async (req, res) => {
	console.log("I  answers");

	res.render("admin/programs");
};

exports.getcourses = async (req, res) => {
	console.log("req.body = = ", req.body);

	const courses = await Courses.find({
		$and: [{ program: req.body.program }, { level: req.body.level }],
	});

	let semesterCourses;

	const misc = {
		semester: req.body.semester == 1 ? "first" : "second",
		level: req.body.level,
	};

	if (req.body.semester == 1) {
		semesterCourses = courses.filter(function (element) {
			return element.courseCode.charAt("2") % 2 !== 1;
		});
	} else if (req.body.semester == 2) {
		semesterCourses = courses.filter(function (element) {
			return element.courseCode.charAt("2") % 2 !== 0;
		});
	}

	console.log("semester  ==== ", semesterCourses);

	res.render("admin/firstsemester", { courses, semesterCourses, misc });
};
