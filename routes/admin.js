const express = require("express");
const app = express();
const router = express.Router();
const admin = require("../controllers/admin");

/**
 * GET REQUEST
 */

router.get("/", admin.getAdminDashboard);

/**
 * POST REQUEST
 */

module.exports = router;
