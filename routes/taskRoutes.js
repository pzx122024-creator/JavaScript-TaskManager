const express = require("express");
const taskController = require("../controllers/taskController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.get("/:id/edit", taskController.showEdit);
router.post("/:id/edit", taskController.updateTask);
router.post("/:id/status", taskController.toggleStatus);
router.post("/:id/delete", taskController.deleteTask);

module.exports = router;
