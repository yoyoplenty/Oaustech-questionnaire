const express = require("express"),
	router = express.Router(),
	result = require("../controllers/result");

// router.get("/", result.getresult);
router.get("/program", result.getprogram);
router.get("/:course", result.geteachresult);

router.post("/showresult", result.getcourses);

// router.post("/", result.createresult);
router.post("/:course", result.saveResult);

//router.delete("/", course.delete);

module.exports = router;
