const express = require("express"),
	router = express.Router(),
	question = require("../controllers/question");
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../configure/auth');
//passport config
require('../configure/passport')(passport)

router.get("/", ensureAuthenticated, question.getQuestion);
router.get("/all", ensureAuthenticated, question.getAllQuestion);
router.get("/edit/:id", ensureAuthenticated, question.geteditQuestion);
//update and delete question
router.put("/:id", ensureAuthenticated, question.editQuestion);
router.post("/", ensureAuthenticated, question.createQuestion);
router.delete("/delete/:id", ensureAuthenticated, question.deleteQuestion);

module.exports = router;
