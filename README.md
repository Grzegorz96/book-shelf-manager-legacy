# Book Shelf Manager

A book library management app built with **Angular 21**. It lets you browse books, add, edit, delete, mark favorites, and filter by genre. It includes authentication, light/dark theme, and a mock API powered by [json-server](https://github.com/typicode/json-server).

## Tech stack

- **Angular** 21 (standalone components, signals, control flow)
- **RxJS** 7.8
- **Lucide Angular** (icons)
- **json-server** (mock REST API)
- **SCSS** (BEM, abstracts, variables)
- **Vitest** (unit tests)

## Prerequisites

- Node.js (LTS or newer recommended)
- npm 11.x (or another package manager from `package.json`)

## Installation

```bash
git clone <repo-url>
cd book-shelf-manager
npm install
```

## Database setup (db.json)

The app uses **json-server** as a mock API. The `db.json` file is **not** in the repository – you need to create it manually in the **project root** (next to `package.json`).

1. Create a file named `db.json` in the project root.
2. Paste the structure below (or your own book list) into it:

```json
{
  "books": [
    {
      "id": "1",
      "title": "Diuna",
      "author": "Frank Herbert",
      "year": 1965,
      "description": "Epicka opowieść o polityce i religii na pustynnej planecie Arrakis.",
      "genre": "Sci-Fi",
      "isFavorite": true
    },
    {
      "id": "2",
      "title": "Wiedźmin: Ostatnie życzenie",
      "author": "Andrzej Sapkowski",
      "year": 1993,
      "description": "Przygody Geralta z Rivii, płatnego zabójcy potworów.",
      "genre": "Fantasy",
      "isFavorite": true
    },
    {
      "id": "3",
      "title": "Rok 1984",
      "author": "George Orwell",
      "year": 1949,
      "description": "Totalitarna wizja przyszłości pod okiem Wielkiego Brata.",
      "genre": "Dystopia",
      "isFavorite": false
    },
    {
      "id": "4",
      "title": "Hobbit",
      "author": "J.R.R. Tolkien",
      "year": 1937,
      "description": "Wyprawa Bilbo Bagginsa do Samotnej Góry.",
      "genre": "Fantasy",
      "isFavorite": false
    },
    {
      "id": "5",
      "title": "Cień wiatru",
      "author": "Carlos Ruiz Zafón",
      "year": 2001,
      "description": "Tajemnica zapomnianej książki w powojennej Barcelonie.",
      "genre": "Mystery",
      "isFavorite": true
    },
    {
      "id": "6",
      "title": "Metro 2033",
      "author": "Dmitry Glukhovsky",
      "year": 2005,
      "description": "Walka o przetrwanie w tunelach moskiewskiego metra.",
      "genre": "Post-apoc",
      "isFavorite": false
    },
    {
      "id": "7",
      "title": "Studium w szkarłacie",
      "author": "A.C. Doyle",
      "year": 1887,
      "description": "Pierwsza sprawa Sherlocka Holmesa i Doktora Watsona.",
      "genre": "Kryminał",
      "isFavorite": false
    },
    {
      "id": "8",
      "title": "Fundacja",
      "author": "Isaac Asimov",
      "year": 1951,
      "description": "Plan ratowania cywilizacji galaktycznej przed upadkiem.",
      "genre": "Sci-Fi",
      "isFavorite": true
    },
    {
      "id": "9",
      "title": "Zbrodnia i kara",
      "author": "Fiodor Dostojewski",
      "year": 1866,
      "description": "Dylematy moralne Raskolnikowa po dokonaniu zbrodni.",
      "genre": "Klasyka",
      "isFavorite": false
    },
    {
      "id": "10",
      "title": "Problem trzech ciał",
      "author": "Cixin Liu",
      "year": 2008,
      "description": "Kontakt z obcą cywilizacją zmienia losy ludzkości.",
      "genre": "Sci-Fi",
      "isFavorite": true
    }
  ]
}
```

Each book must have: `id`, `title`, `author`, `year`, `description`, `genre`, `isFavorite`. Without a valid `db.json`, the API on port 3001 will not return data and the book list will not load.

## Running the project

You need **two terminals**: one for the Angular app, one for json-server.

**Terminal 1 – backend (mock API):**

```bash
npm run json-server
```

The API server runs at `http://localhost:3001`.

**Terminal 2 – frontend (Angular):**

```bash
npm start
```

The app is available at `http://localhost:4200/`.

Both servers must be running at the same time – Angular fetches books from `http://localhost:3001/books`.

## Available scripts

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `npm start`           | Start dev server (port 4200)              |
| `npm run build`       | Build for production into `dist/`         |
| `npm run watch`       | Build in watch mode (development)         |
| `npm run json-server` | Start mock API with `db.json` (port 3001) |
| `npm test`            | Run unit tests (Vitest)                   |

## App structure (overview)

- **`src/app/core/`** – directives (e.g. backdrop-click), guards (auth), layout (header, footer, main), pipes, services (auth, scroll, theme, template-page-title)
- **`src/app/features/`** – feature modules: home, auth, books (list, cards, details, form, modal), not-found
- **`src/app/shared/`** – shared components (error-modal, logo)
- **`src/styles/`** – global styles (abstracts, base, components)

## Production build

```bash
npm run build
```

Output goes to the `dist/` directory.

## Tests

```bash
npm test
```

The project uses **Vitest** for unit tests.
