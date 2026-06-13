const User = require("./User");
const Subject = require("./Subject");
const Task = require("./Task");

// Definiujemy relacje w jednym miejscu, aby łatwo pokazać strukturę bazy.
User.hasMany(Subject, { foreignKey: "userId", onDelete: "CASCADE" });
Subject.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });

Subject.hasMany(Task, { foreignKey: "subjectId", onDelete: "SET NULL" });
Task.belongsTo(Subject, { foreignKey: "subjectId" });

module.exports = { User, Subject, Task };
