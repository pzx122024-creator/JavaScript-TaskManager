const express = require("express");
const subjectController = require("../controllers/subjectController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth); // Wszystkie trasy poniżej wymagają logowania
router.get("/", subjectController.getSubjects); // lista przedmiotów
router.post("/", subjectController.createSubject); // dodanie
router.post("/:id/delete", subjectController.deleteSubject); // usunięcie

module.exports = router;
