const Course = require("../models/courses");
const Admin = require('../models/admin')
const express = require('express')
const app = express();
const bcrypt = require('bcryptjs')
const passport = require('passport');
const admin = require("../models/admin");

exports.getHome = async (req, res) => {
	res.render("admin/index");
};
exports.getAdminDashboard = async (req, res) => {
	let admin = req.session.admin
	console.log(admin)
	res.render("admin/admin", {
		layout: 'admin',
		admin
	});
};
exports.getRegister = async (req, res) => {
	res.render('admin/register', {
		title: 'Admin Register',
	})
};
exports.login = async (req, res, next) => {
	let { email } = req.body
	let admin = await Admin.findOne({ email: email })
	req.session.admin = admin;
	passport.authenticate('local', {
		successRedirect: '/admin/dashboard',
		failureRedirect: '/admin/login',
		failureFlash: true
	})(req, res, next);
};
exports.register = async (req, res) => {
	console.log(req.body)
	const { firstname, lastname, worklevel, email, password, password2 } = req.body
	let errors = [];
	//check fields
	if (!firstname || !lastname || !worklevel || !email || !password || !password2) {
		errors.push({ msg: 'please fill in all fields' })
	}
	//password match
	if (password !== password2) {
		errors.push({ msg: 'password does not match' })
	}
	//check password length
	if (password.length < 6) {
		errors.push({ msg: 'password should be at least 6 characters' })
	}
	if (errors.length > 0) {
		res.render('admin/register', {
			Title: `Admin Register Page`,
			errors,
			firstname,
			lastname,
			worklevel,
			email,
			password,
			password2
		})
	} else {
		//validation is passed here
		await Admin.findOne({ email: email })
			.then(admin => {
				if (admin) {
					//user exist while trying to register a new one
					errors.push({ msg: 'Email Address is already registered' })
					res.render('admin/register', {
						Title: `Register Here`,
						errors,
						firstname,
						lastname,
						worklevel,
						email,
						password,
						password2
					})
				} else {
					//everything goes well here, no email found with that matric no in the database
					let newadmin = new Admin({
						firstname,
						lastname,
						worklevel,
						email,
						password
					});
					//hash the password before saving it
					bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newadmin.password, salt, (err, hash) => {
						if (err) throw err
						//set password to hash;
						newadmin.password = hash
						//save the user input for registration
						newadmin.save()
							.then(admin => {
								res.render('admin/login', {
									title: 'Admin Page',
									message: 'you are now registered and can login in',
									admin: admin,
									password
								})

							}).catch(err => {
								console.log(err)
							})
					}))

				}
			})
	}
};
exports.getLogin = async (req, res) => {
	res.render('admin/login', {
		title: 'Admin Page',
	})
};
