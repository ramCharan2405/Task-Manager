const express=require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUserReport } = require("../controllers/reportController");

const router=express.Router();

router.get("/export/tasks",protect, adminOnly,exportTasksReport);
router.get("/export/users",protect,adminOnly,exportUserReport)

module.exports=router