const { Task, Subject } = require("../models");

const allowedPriorities = ["low", "medium", "high"];
const allowedStatuses = ["all", "todo", "done"];

function validateTask(data) {
  // Ta sama podstawowa walidacja działa również na serwerze.
  if (data.title.length < 2 || !data.dueDate) {
    return "Nazwa zadania i termin są wymagane.";
  }

  if (!allowedPriorities.includes(data.priority)) {
    return "Wybrano nieprawidłowy priorytet.";
  }

  return "";
}

async function subjectBelongsToUser(subjectId, userId) {
  if (!subjectId) {
    return true;
  }

  return Boolean(await Subject.findOne({ where: { id: subjectId, userId } }));
}

function prepareFilters(query) {
  return {
    status: allowedStatuses.includes(query.status) ? query.status : "all",
    priority: allowedPriorities.includes(query.priority) ? query.priority : "all",
    subjectId: /^\d+$/.test(String(query.subjectId || ""))
      ? String(query.subjectId)
      : "all"
  };
}

function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    const statusMatches = filters.status === "all" || task.status === filters.status;
    const priorityMatches =
      filters.priority === "all" || task.priority === filters.priority;
    const subjectMatches =
      filters.subjectId === "all" || String(task.subjectId) === filters.subjectId;

    return statusMatches && priorityMatches && subjectMatches;
  });
}

function countStatistics(tasks) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    todo: tasks.filter((task) => task.status === "todo").length,
    overdue: tasks.filter(
      (task) => task.status === "todo" && task.dueDate < today
    ).length,
    done: tasks.filter((task) => task.status === "done").length
  };
}

async function getTasks(req, res, next) {
  try {
    const userId = req.session.user.id;
    const allTasks = await Task.findAll({
      where: { userId },
      include: Subject,
      order: [
        ["status", "ASC"],
        ["dueDate", "ASC"]
      ]
    });
    const subjects = await Subject.findAll({
      where: { userId },
      order: [["name", "ASC"]]
    });
    const filters = prepareFilters(req.query);

    res.render("tasks/index", {
      title: "Moje zadania",
      tasks: filterTasks(allTasks, filters),
      subjects,
      filters,
      statistics: countStatistics(allTasks),
      today: new Date().toISOString().slice(0, 10),
      error: req.query.error || "",
      success: req.query.success || ""
    });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const userId = req.session.user.id;
    const data = {
      title: String(req.body.title || "").trim(),
      description: String(req.body.description || "").trim(),
      dueDate: String(req.body.dueDate || ""),
      priority: String(req.body.priority || "medium"),
      subjectId: req.body.subjectId || null
    };
    const validationError = validateTask(data);

    if (validationError || !(await subjectBelongsToUser(data.subjectId, userId))) {
      return res.redirect(
        "/tasks?error=" +
          encodeURIComponent(validationError || "Wybrany przedmiot jest nieprawidłowy.")
      );
    }

    await Task.create({ ...data, userId });
    res.redirect("/tasks?success=" + encodeURIComponent("Dodano nowe zadanie."));
  } catch (error) {
    next(error);
  }
}

async function showEdit(req, res, next) {
  try {
    const userId = req.session.user.id;
    const task = await Task.findOne({ where: { id: req.params.id, userId } });

    if (!task) {
      return res.status(404).render("errors/error", {
        title: "Nie znaleziono zadania",
        message: "To zadanie nie istnieje lub należy do innego użytkownika."
      });
    }

    const subjects = await Subject.findAll({
      where: { userId },
      order: [["name", "ASC"]]
    });

    res.render("tasks/edit", {
      title: "Edycja zadania",
      task,
      subjects,
      error: req.query.error || ""
    });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const userId = req.session.user.id;
    const task = await Task.findOne({ where: { id: req.params.id, userId } });

    if (!task) {
      return res.status(404).render("errors/error", {
        title: "Nie znaleziono zadania",
        message: "Nie można edytować tego zadania."
      });
    }

    const data = {
      title: String(req.body.title || "").trim(),
      description: String(req.body.description || "").trim(),
      dueDate: String(req.body.dueDate || ""),
      priority: String(req.body.priority || "medium"),
      subjectId: req.body.subjectId || null
    };
    const validationError = validateTask(data);

    if (validationError || !(await subjectBelongsToUser(data.subjectId, userId))) {
      return res.redirect(
        `/tasks/${task.id}/edit?error=` +
          encodeURIComponent(validationError || "Wybrany przedmiot jest nieprawidłowy.")
      );
    }

    await task.update(data);
    res.redirect("/tasks?success=" + encodeURIComponent("Zapisano zmiany."));
  } catch (error) {
    next(error);
  }
}

async function toggleStatus(req, res, next) {
  try {
    const userId = req.session.user.id;
    const task = await Task.findOne({ where: { id: req.params.id, userId } });

    if (!task) {
      return res.redirect("/tasks?error=" + encodeURIComponent("Nie znaleziono zadania."));
    }

    // Jednym przyciskiem możemy zakończyć zadanie albo przywrócić je do wykonania.
    await task.update({ status: task.status === "done" ? "todo" : "done" });
    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const deletedRows = await Task.destroy({
      where: { id: req.params.id, userId: req.session.user.id }
    });

    const message = deletedRows ? "Usunięto zadanie." : "Nie znaleziono zadania.";
    res.redirect("/tasks?success=" + encodeURIComponent(message));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  showEdit,
  updateTask,
  toggleStatus,
  deleteTask
};
