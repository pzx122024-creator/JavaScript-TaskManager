const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Model zadania zawiera pola potrzebne w planerze studenckim
const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    allowNull: false,
    defaultValue: "medium"
  },
  status: {
    type: DataTypes.ENUM("todo", "done"),
    allowNull: false,
    defaultValue: "todo"
  }
});

module.exports = Task;
