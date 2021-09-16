const express = require("express"),
	router = express.Router(),
	question = require("../controllers/question");

router.get("/", question.getQuestion);
router.get("/all", question.getAllQuestion);
router.get("/edit/:id", question.geteditQuestion);
//update and delete question
router.put("/:id", question.editQuestion);
router.post("/", question.createQuestion);
router.delete("/delete/:id", question.deleteQuestion);

module.exports = router;
