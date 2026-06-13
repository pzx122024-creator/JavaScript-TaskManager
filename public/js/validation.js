// Przeglądarka sprawdza formularz przed wysłaniem, a serwer sprawdza go ponownie.
document.querySelectorAll(".js-task-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    const title = form.querySelector('[name="title"]');

    if (title && title.value.trim().length < 2) {
      event.preventDefault();
      alert("Nazwa zadania musi mieć co najmniej 2 znaki.");
      title.focus();
    }
  });
});

// Przed usunięciem prosimy o potwierdzenie, aby uniknąć przypadkowego kliknięcia.
document.querySelectorAll(".js-confirm-delete").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!confirm("Czy na pewno chcesz usunąć ten element?")) {
      event.preventDefault();
    }
  });
});
