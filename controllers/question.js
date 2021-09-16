const Question = require("../models/question");

exports.createQuestion = async (req, res) => {

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
exports.getAllQuestion = async (req, res) => {
	try {
		let allQuestions = await Question.find({})

		allQuestions.sort((a, b) => a.sn - b.sn)
		res.render('admin/allquestion', {
			question: allQuestions
		})
	} catch (error) { }
};
exports.geteditQuestion = async (req, res) => {
	try {
		let ID = req.params.id
		let exactQuestion = await Question.findById(ID)
		//console.log(exactQuestion)
		res.render('admin/editquestion', {
			question: exactQuestion
		})
	} catch (error) { }
};
exports.editQuestion = async (req, res) => {
	try {
		console.log(req.body)
		let ID = req.params.id

		//setting the specific question to a variable 
		req.question = await Question.findById(ID)
		let question = req.question
		//check if it was not updated

		console.log((req.body.question === question.question || req.body.sn === question.sn))
		if (req.body.question === question.question || req.body.sn === question.sn) {
			req.flash("error", "Please Nothing was updated");
			return res.redirect(`/question/edit/${ID}`)
		}
		//set the previous question to the new one
		question.question = req.body.question
		question.sn = req.body.sn
		//get it saved
		question = await question.save()
		if (question) {
			req.flash(`success`, `Question was updated successfully`)
			res.redirect('/question/all')
		} else {
			req.flash("error", "Please Nothing was updated");
			return res.redirect(`/question/edit/${ID}`)
		}
	} catch (error) { }
};
exports.deleteQuestion = async (req, res) => {
	try {
		let ID = req.params.id
		await Question.findByIdAndDelete(ID)
		req.flash(`success`, `Question was deleted successfully`)
		res.redirect('/question/all')
	} catch (error) { }
};

