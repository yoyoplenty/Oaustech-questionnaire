const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const questionSchema = new mongoose.Schema(
	{
		// level: {
		// 	type: String,
		// 	require: false,
		// },
		// course: {
		// 	type: String,
		// 	require: false,
		// },
		sn: {
			type: Number,
			require: true,
		},
		question: {
			type: String,
			require: false,
		},
		courseCode: {
			type: String,
			require: true,
		},
		answers: [],
		answered: [],
	},
	{ timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Question", questionSchema);
