const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Model opisuje tabelę użytkowników w bazie danych.
const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;
