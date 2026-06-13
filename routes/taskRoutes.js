const express = require("express");
const taskController = require("../controllers/taskController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth); // Wszystkie trasy poniżej wymagają logowania
router.get("/", taskController.getTasks); // lista
router.post("/", taskController.createTask); // utworzenie
router.get("/:id/edit", taskController.showEdit); // formularz edycji
router.post("/:id/edit", taskController.updateTask); // zapis edycji
router.post("/:id/status", taskController.toggleStatus); // zmiana statusu
router.post("/:id/delete", taskController.deleteTask); // usunięcie

module.exports = router;
