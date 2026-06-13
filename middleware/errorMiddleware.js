function notFound(req, res) {
  res.status(404).render("errors/error", {
    title: "Nie znaleziono strony",
    message: "Podany adres nie istnieje."
  });
}

function errorHandler(error, req, res, next) {
  // Zapisujemy szczegóły w terminalu, ale użytkownikowi pokazujemy prosty komunikat.
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).render("errors/error", {
    title: "Błąd aplikacji",
    message: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie."
  });
}

module.exports = { notFound, errorHandler };
