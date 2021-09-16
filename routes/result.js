const express = require("express"),
    router = express.Router(),
    result = require("../controllers/result");

router.get("/", result.getresult);
router.get("/", result.getresult);
router.get("/all", result.getallResult);
router.get("/:course", result.geteachresult);
router.post("/", result.createresult);
//Delete Results of each Course
router.delete("/delete/:course", result.deleteResult);

module.exports = router;
