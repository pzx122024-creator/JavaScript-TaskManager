const path = require("path");
const { Sequelize } = require("sequelize");

// SQLite zapisuje wszystkie dane w jednym pliku, więc nie potrzebujemy osobnego serwera bazy
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
  logging: false //wyłącza wypisywanie zapytań SQL
});

module.exports = sequelize;
