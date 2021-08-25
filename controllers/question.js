const Question = require("../models/question"),
	Course = require("../models/courses");

exports.createQuestion = async (req, res) => {
	console.log("I am here");
	const courses = await Course.find({});

	console.log(courses);
	for (let i = 0; i < courses.length; i++) {
		console.log("Saving question ", i);
		const question = await Question.create({
			sn: (await Question.countDocuments()) + 1,
			question: req.body.question,
			courseCode: `${courses[i].courseName}${courses[i].courseCode}`,
		});
		console.log("question  = ", question);
	}

	// if (!question) {
	// 	return res.render("admin/addquestion", {
	// 		error: "could not save question",
	// 	});
	// }

	res.render("admin/addquestion", {
		success: "question added successfully",
	});
};

exports.getQuestion = async (req, res) => {
	// res.render("")
	res.render("admin/addquestion");
};
