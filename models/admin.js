const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const adminSchema = new mongoose.Schema({
	firstname: {
		type: String,
		require: true,
	},
	lastname: {
		type: String,
		require: true,
	},
	worklevel: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Admin", adminSchema);
