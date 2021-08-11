const express = require("express"),
    router = express.Router(),
    result = require("../controllers/result");

router.get("/", result.getresult);
router.get("/:course", result.geteachresult);
router.post("/", result.createresult);
//router.delete("/", course.delete);

module.exports = router;
