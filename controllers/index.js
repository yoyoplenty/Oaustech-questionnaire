const Student = require("../models/Students"),
	utility = require("../services/utilities"),
	bcrypt = require("bcryptjs");

exports.getRegistrationForm = async (req, res) => {
	console.log("I will get the registration form now");
	res.render("register");
};
/*exports.getLoginForm = async (req, res) => {
	console.log("I will get the login form now");
	res.render("login");
};
exports.signup = async (req, res) => {
	console.log("I will send the registration details now");

	console.log(req.body);

	var {
		firstname,
		surname,
		program,
		email,
		level,
		matricNo,
		password,
		password2,
	} = req.body;

	let errors = [];
	//check fields
	if (!firstname || !surname || !email || !password || !password2) {
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
								res.redirect("/login");
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
	console.log("I will send the login details now");
	const { matricNo } = req.body;

	console.log(req.body);

	const student = await Student.findOne({ matricNo: matricNo });

	console.log(student);
	if (!student) {
		return res.render("login", {
			message: "please login with a valid credentials",
		});
	}

	const checkPassword = await utility.checkPassword(
		req.body.password,
		student.password
	);

	console.log(checkPassword);

	if (checkPassword !== true) {
		return res.render("login", {
			message: "please login with a valid credentials",
		});
	}

	req.session.user = student;

	res.render("studentdashboard", { student: student });
};
 */
exports.gethomepage = async (req, res) => {
	try {
		res.render("home");
	} catch (error) { }
};
exports.age = async (req, res) => {
	console.log(req.session.user);
};
