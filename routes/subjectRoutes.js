const express = require("express");
const subjectController = require("../controllers/subjectController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", subjectController.getSubjects);
router.post("/", subjectController.createSubject);
router.post("/:id/delete", subjectController.deleteSubject);

module.exports = router;
