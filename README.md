# Pirate Name Generator

A very silly Vue 3 app that generates pirate names with a touch of dark humor. Don't like the random pirate? Just kill him off with a memorable cause of death and a new pirate will be press-ganged.

## Demo

The app is published on GitHub Pages:

https://voidstate.github.io/pirate-names/

## Features

- Generate random pirate names from themed templates
- Mix adjectives, nouns, forenames, and surnames
- Choose English, French, Spanish, or any nationality for generated names
- Keep a short log of recently generated names
- Simple, lightweight Vue 3 experience with Vite

## Tech Stack

- Vue 3
- Vue Router
- Vite
- ESLint / Prettier

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for production

```bash
npm run build
```

The production build will be generated in the `dist` directory.

### Deploy to a subfolder using FTP

Build the app locally with relative asset paths:

```bash
npm run build:ftp
```

The FTP build is generated in `dist-ftp`, leaving the normal `dist` build untouched. Upload the **contents** of `dist-ftp` to the target website folder using your FTP client. For example, uploading them to `public_html/tools/pirate-names/` makes the app available at `https://example.com/tools/pirate-names/`. Do not upload the project source files or the `dist-ftp` directory itself.

The app is static and uses hash-based routes, so it does not need a server, backend, or special rewrite rules. Build it on a computer with Node.js/npm, then use FTP only to upload the built files.

### Lint the project

```bash
npm run lint
```

## Deployment

This project is configured for deployment to GitHub Pages using GitHub Actions.

When changes are pushed to the `main` branch, the workflow builds the app and publishes it automatically.

## Project Structure

```text
src/
  components/      # Vue components
  data/            # JSON datasets; forenames.json and surnames.json group names by nationality
  assets/          # Styles and static assets
```

## Contributing

Contributions are welcome. If you have ideas or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the Unlicense. See the [LICENSE](LICENSE) file for details.
