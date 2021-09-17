const express = require("express"),
    router = express.Router(),
    result = require("../controllers/result");
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../configs/auth');
//passport config
require('../configs/passport')(passport)

router.get("/", ensureAuthenticated, result.getresult);
router.get("/", ensureAuthenticated, result.getresult);
router.get("/all", ensureAuthenticated, result.getallResult);
router.get("/:course", ensureAuthenticated, result.geteachresult);
router.post("/", ensureAuthenticated, result.createresult);
//Delete Results of each Course
router.delete("/delete/:course", ensureAuthenticated, result.deleteResult);

module.exports = router;
