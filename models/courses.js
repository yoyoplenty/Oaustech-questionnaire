const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const courseSchema = new mongoose.Schema(
	{
		courseName: {
			type: String,
			require: true,
		},
		courseCode: {
			type: String,
			required: true,
		},
		level: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Course", courseSchema);
