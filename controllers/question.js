const Question = require("../models/question");

exports.createQuestion = async (req, res) => {
	console.log(req.body);

	const question = await Question.create({
		sn: (await Question.countDocuments()) + 1,
		question: req.body.question,
	});

	if (!question) {
		return res.render("admin/addquestion", {
			error: "could not save question",
		});
	}

	res.render("admin/addquestion", {
		success: "question added successfully",
	});
};

exports.getQuestion = async (req, res) => {
	// res.render("")
	res.render("admin/addquestion");
};
