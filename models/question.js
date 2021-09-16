const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const questionSchema = new mongoose.Schema(
	{
		sn: {
			type: Number,
			require: true,
		},
		question: {
			type: String,
			require: false,
		},
	},
	{ timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Question", questionSchema);
