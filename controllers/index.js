const Student = require("../models/Students"),
	utility = require("../services/utilities"),
	bcrypt = require("bcryptjs");

exports.getRegistrationForm = async (req, res) => {
	console.log("I will get the registration form now");
	res.render("register");
};
exports.gethomepage = async (req, res) => {
	try {
		res.render("home", {
			layout: 'home',
		});
	} catch (error) { }
};
exports.age = async (req, res) => {
	console.log(req.session.user);
};
