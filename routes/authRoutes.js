const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Routing łączy adres strony z odpowiednią funkcją kontrolera
router.get("/login", authController.showLogin); //pokazuje formularz
router.post("/login", authController.login);  // przetwarza dane
router.get("/register", authController.showRegister);  //pokazuje rejestrację
router.post("/register", authController.register);  //tworzy konto
router.post("/logout", authController.logout);  //wylogowuje

module.exports = router;
