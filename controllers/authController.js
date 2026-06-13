const crypto = require("crypto");
const { promisify } = require("util");
const { User } = require("../models");

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  // Losowa sól sprawia, że takie same hasła nie mają identycznego zapisu w bazie.
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)).toString("hex");
  return `${salt}:${hash}`;
}

async function passwordIsCorrect(password, storedValue) {
  const [salt, storedHash] = storedValue.split(":");
  const hash = (await scrypt(password, salt, 64)).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

function showLogin(req, res) {
  res.render("auth/login", {
    title: "Logowanie",
    error: req.query.error || "",
    success: req.query.success || ""
  });
}

function showRegister(req, res) {
  res.render("auth/register", {
    title: "Rejestracja",
    error: req.query.error || ""
  });
}

async function register(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email.includes("@") || password.length < 6) {
      return res.redirect(
        "/register?error=" +
          encodeURIComponent("Podaj poprawny e-mail i hasło mające co najmniej 6 znaków.")
      );
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.redirect(
        "/register?error=" + encodeURIComponent("Konto z tym adresem już istnieje.")
      );
    }

    await User.create({
      email,
      passwordHash: await hashPassword(password)
    });

    res.redirect(
      "/login?success=" + encodeURIComponent("Konto zostało utworzone. Możesz się zalogować.")
    );
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ where: { email } });

    if (!user || !(await passwordIsCorrect(password, user.passwordHash))) {
      return res.redirect(
        "/login?error=" + encodeURIComponent("Nieprawidłowy e-mail lub hasło.")
      );
    }

    // W sesji przechowujemy tylko dane potrzebne podczas korzystania z aplikacji
    req.session.user = { id: user.id, email: user.email };
    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.redirect("/login?success=" + encodeURIComponent("Wylogowano poprawnie."));
  });
}

module.exports = { showLogin, showRegister, register, login, logout };
