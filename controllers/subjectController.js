const { Subject, Task } = require("../models");

// Korzystamy z gotowej palety, aby kolory były czytelne i bezpieczne w widoku.
const allowedColors = [
  "#5b5bd6",
  "#0f9d8a",
  "#e07a35",
  "#d14d72",
  "#3b82c4",
  "#7b61a8"
];

// Pobiera tylko przedmioty zalogowanego użytkownika i sortuje je alfabetycznie
async function getSubjects(req, res, next) {
  try {
    const subjects = await Subject.findAll({
      where: { userId: req.session.user.id },
      order: [["name", "ASC"]]
    });
      // przekazanie do widoku 
    res.render("subjects/index", {
      title: "Przedmioty",
      subjects,
      allowedColors,
      error: req.query.error || "",
      success: req.query.success || ""
    });
  } catch (error) {
    next(error);
  }
}

async function createSubject(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const color = allowedColors.includes(req.body.color)
      ? req.body.color
      : allowedColors[0];

    if (name.length < 2 || name.length > 50) {
      return res.redirect(
        "/subjects?error=" + encodeURIComponent("Nazwa musi mieć od 2 do 50 znaków.")
      );
    }

    await Subject.create({ name, color, userId: req.session.user.id });
    res.redirect("/subjects?success=" + encodeURIComponent("Dodano przedmiot."));
  } catch (error) {
    next(error);
  }
}

async function deleteSubject(req, res, next) {
  try {
    const userId = req.session.user.id;
    const subject = await Subject.findOne({ where: { id: req.params.id, userId } });

    if (!subject) {
      return res.redirect(
        "/subjects?error=" + encodeURIComponent("Nie znaleziono przedmiotu.")
      );
    }

    // Najpierw odłączamy zadania, aby ich nie utracić po usunięciu przedmiotu.
    await Task.update(
      { subjectId: null },
      { where: { subjectId: subject.id, userId } }
    );
    await subject.destroy();

    res.redirect("/subjects?success=" + encodeURIComponent("Usunięto przedmiot."));
  } catch (error) {
    next(error);
  }
}

module.exports = { getSubjects, createSubject, deleteSubject };
