const express = require("express"),
	router = express.Router(),
	question = require("../controllers/question");

router.get("/", question.getQuestion);
router.post("/", question.createQuestion);

module.exports = router;
