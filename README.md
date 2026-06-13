# TaskManager

TaskManager to prosty planer studencki wykonany w technologii JavaScript. Aplikacja działa w przeglądarce i pozwala każdemu użytkownikowi zarządzać własnymi zadaniami.

## Najważniejsze funkcje

- rejestracja, logowanie i wylogowanie,
- dodawanie, edycja i usuwanie zadań,
- oznaczanie zadań jako wykonane,
- terminy, priorytety i przedmioty,
- wybór koloru dla przedmiotu,
- filtrowanie zadań według statusu, priorytetu i przedmiotu,
- proste statystyki oraz oznaczenie zadań po terminie,
- podział na zadania „Do zrobienia” i „Zakończone”,
- walidacja formularzy w przeglądarce i na serwerze,
- dane zapisane w lokalnej bazie SQLite,
- architektura MVC i podstawowa obsługa błędów.

## Jak uruchomić projekt

### 1. Zainstaluj Node.js

Pobierz wersję LTS ze strony: https://nodejs.org/

Podczas instalacji można pozostawić ustawienia domyślne.

### 2. Otwórz terminal w folderze projektu

W Eksploratorze plików otwórz folder, w którym znakduje się proejkt. Kliknij pasek adresu, wpisz `cmd` i naciśnij Enter.

### 3. Zainstaluj biblioteki

Wpisz:
npm install


Tę operację wykonujemy tylko pierwszy raz lub po usunięciu folderu `node_modules`.

### 4. Uruchom aplikację

Wpisz:
npm start


### 5. Otwórz stronę

W przeglądarce przejdź pod adres:
http://localhost:3000

### 6. Zatrzymaj aplikację

W terminalu naciśnij:
Ctrl + C

## Technologie

- JavaScript - język projektu,
- Node.js - środowisko uruchamiające JavaScript poza przeglądarką,
- Express - obsługa serwera i routingu,
- EJS - generowanie widoków HTML,
- Sequelize - komunikacja z bazą danych,
- SQLite - prosta lokalna baza danych,
- express-session - zapamiętywanie zalogowanego użytkownika.

