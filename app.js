const express = require("express");
const session = require("express-session");
const path = require("path");

//Import bazy i modeli
const sequelize = require("./config/db");
require("./models");

//Import tras i błędów 
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

//Utworzenie aplikacji i port 
const app = express();
const PORT = process.env.PORT || 3000;

// Odczytujemy dane wysyłane przez formularze HTML
app.use(express.urlencoded({ extended: false }));

// Udostępniamy przeglądarce pliki CSS i JavaScript z katalogu public
app.use(express.static(path.join(__dirname, "public")));

// Sesja pozwala nam zapamiętać, który użytkownik jest zalogowany.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "klucz",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }
  })
);

//Konfiguracja EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Te dane są dostępne w każdym widoku EJS, np. w nagłówku strony
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

//Jeżeli użytkownik jest zalogowany, trafia do zadań. W przeciwnym razie do logowania
app.get("/", (req, res) => {
  res.redirect(req.session.user ? "/tasks" : "/login");
});

//Podłączenie routerów
app.use(authRoutes);
app.use("/tasks", taskRoutes);
app.use("/subjects", subjectRoutes);

// Obsługa błędów znajduje się na końcu, po wszystkich trasach
app.use(notFound);
app.use(errorHandler);

//Uruchomienie aplikacji
async function startApplication() {
  try {
    // Najpierw tworzymy brakujące tabele.
    await sequelize.sync();

    // To prosta migracja dla starszej bazy: dodajemy kolumnę koloru bez usuwania danych
    const queryInterface = sequelize.getQueryInterface();
    const subjectColumns = await queryInterface.describeTable("Subjects");
    if (!subjectColumns.color) {
      const { DataTypes } = require("sequelize");
      await queryInterface.addColumn("Subjects", "color", {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#5b5bd6"
      });
    }

    return app.listen(PORT, () => {
      console.log(`TaskManager działa na stronie: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Nie udało się uruchomić aplikacji:", error);
    process.exit(1);
  }
}

// Przy zwykłym uruchomieniu startujemy serwer, a test może tylko zaimportować aplikację
if (require.main === module) {
  startApplication();
}

module.exports = { app, startApplication };
