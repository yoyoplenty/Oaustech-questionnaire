const express = require("express");
const app = express();
const router = express.Router();
const admin = require("../controllers/admin");
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../configure/auth');
//passport config
require('../configure/passport')(passport)

/**
 * GET REQUEST
 */
router.get("/", admin.getHome);
router.get("/dashboard", ensureAuthenticated, admin.getAdminDashboard);
router.get("/register", admin.getRegister);
router.get("/login", admin.getLogin);


/**
 * POST REQUEST
 */
router.post("/register", admin.register);
router.post('/login', admin.login);



module.exports = router;
