const Student = require("../models/Students"),
	utility = require("../services/utilities"),
	bcrypt = require("bcryptjs"),
	Courses = require("../models/courses"),
	Question = require("../models/question"),
	Result = require("../models/Results")

exports.getRegistrationForm = async (req, res) => {
	res.render("register");
};

exports.getLoginForm = async (req, res) => {
	res.render("login", {
		layout: 'form',
	});
};

exports.signup = async (req, res) => {
	console.log(req.body);

	var {
		firstname,
		surname,
		program,
		email,
		sex,
		level,
		matricNo,
		password,
		password2,
	} = req.body;

	let errors = [];
	//check fields
	if (!firstname || !sex || !surname || !email || !password || !password2) {
		errors.push({ msg: "please fill in all fields" });
	}
	//password match
	if (password !== password2) {
		errors.push({ msg: "password does not match" });
	}
	//check password length
	if (password.length < 6) {
		errors.push({ msg: "password should be at least 6 characters" });
	}
	if (errors.length > 0) {
		res.render("register", {
			Title: `Register Here`,
			errors,
			firstname,
			surname,
			program,
			level,
			sex,
			matricNo,
			email,
			password,
			password2,
		});
	} else {
		console.log("PASSWORD IS CORRECT");
		//validation is passed here
		await Student.findOne({ matricNo: matricNo }).then((student) => {
			if (student) {
				//user exist while trying to register a new one
				errors.push({ msg: "matric Number is already registered" });
				res.render("register", {
					Title: `Register Here`,
					errors,
					firstname,
					surname,
					program,
					level,
					sex,
					matricNo,
					email,
					password,
					password2,
				});
			} else {
				//everything goes well here, no email found with that matric no in the database

				let newStudent = new Student({
					firstname,
					surname,
					matricNo,
					program,
					sex,
					level,
					email,
					password,
				});
				//hash the password before saving it
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newStudent.password, salt, (err, hash) => {
						if (err) throw err;
						//set password to hash;
						newStudent.password = hash;
						//save the user input for registration
						newStudent
							.save()
							.then((student) => {
								req.flash(
									"success",
									"you are now registered and can login in"
								);
								res.redirect("/student/login");
							})
							.catch((err) => {
								console.log(err);
							});
					})
				);
			}
		});
	}
};

exports.signin = async (req, res) => {
	const { matricNo } = req.body;
	const student = await Student.findOne({ matricNo: matricNo });
	if (!student) {
		return res.render("login", {
			message: "please login with a valid credentials",
		});
	}
	const checkPassword = await utility.checkPassword(
		req.body.password,
		student.password
	);

	if (checkPassword !== true) {
		return res.render("login", {
			message: "please login with a valid credentials",
		});
	}
	//user profile and data
	req.session.user = student;
	let totalNo = await Courses.find({
		$and: [{ program: student.program }, { level: student.level }],
	}).countDocuments()
	let ansNo = await Result.find({ matricNo: student.matricNo }).countDocuments()
	let leftNo = totalNo - ansNo
	//let eachCourse = await Result.find({ matricNo: student.matricNo })
	console.log(totalNo)
	//console.log(eachCourse)
	res.render("studentdashboard", { student: student, totalNo, ansNo, leftNo });
};

exports.getdashboard = async (req, res) => {
	let student = req.session.user
	let totalNo = await Courses.find({
		$and: [{ program: student.program }, { level: student.level }],
	}).countDocuments()
	let ansNo = await Result.find({ matricNo: student.matricNo }).countDocuments()
	let leftNo = totalNo - ansNo
	//let eachCourse = await Result.find({ matricNo: student.matricNo })
	console.log(totalNo)
	//console.log(eachCourse)
	res.render("studentdashboard", { student: student, totalNo, ansNo, leftNo });
};

exports.firstsemester = async (req, res) => {
	try {
		let student = req.session.user
		console.log("student = ", student);

		//to Get all courses
		let Course = await Courses.find({
			$and: [{ program: student.program }, { level: student.level }],
		});
		//	let allCourses = Course.slice(0)
		console.log(Course)

		let semesterCourses = Course.filter(function (first) {
			return first.courseCode.charAt("2") % 2 !== 0;
		});

		//render first semester course of student logged in
		if (student) {
			return res.render('courses/firstsemester', {
				first: semesterCourses,
				student
			})
		}
	} catch (error) { }
};

exports.secondsemester = async (req, res) => {
	try {
		let student = req.session.user
		console.log("student = ", student);

		//to Get all courses
		let Course = await Courses.find({
			$and: [{ program: student.program }, { level: student.level }],
		});
		//	let allCourses = Course.slice(0)
		console.log(Course)

		let semesterCourses = Course.filter(function (second) {
			return second.courseCode.charAt("2") % 2 == 0;
		});

		//render second semester courses of student logged in
		if (student) {
			return res.render('courses/secondsemester', {
				second: semesterCourses,
				student
			})
		}

	} catch (error) { }
};

exports.getEachCourseQuestion = async (req, res) => {
	try {
		//set session to user
		let student = req.session.user
		let courses = req.params
		//set session to particular course
		req.session.course = courses;

		//get Questions from database
		let question = await Question.find({})
		question.sort((a, b) => a.sn - b.sn)

		if (courses) {
			return res.render('question', {
				question: question,
				course: courses.course
			})
		}
	} catch (error) { }
};
