const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Przedmiot pomaga nam grupować zadania, np. JavaScript lub Bazy danych
const Subject = sequelize.define("Subject", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "#5b5bd6"
  }
});

module.exports = Subject;
