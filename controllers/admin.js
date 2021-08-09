const Course = require("../models/courses");

exports.getAdminDashboard = async (req, res) => {
	res.render("admin/admin");
};
