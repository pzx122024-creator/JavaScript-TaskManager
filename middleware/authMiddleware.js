function requireAuth(req, res, next) {
  // Chronimy widoki zadań przed osobami, które nie są zalogowane.
  if (!req.session.user) {
    return res.redirect("/login?error=" + encodeURIComponent("Najpierw się zaloguj."));
  }

  next();
}

module.exports = requireAuth;
