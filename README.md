# Pirate Name Generator

A very silly Vue 3 app that generates pirate names with a touch of dark humor. Don't like the random pirate? Just kill him off with a memorable cause of death and a new pirate will be press-ganged.

## Demo

The app is published on GitHub Pages:

https://voidstate.github.io/pirate-names/

## Features

- Generate random pirate names from themed templates
- Mix adjectives, nouns, forenames, and surnames
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
  data/            # JSON datasets for name generation
  assets/          # Styles and static assets
```

## Contributing

Contributions are welcome. If you have ideas or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the Unlicense. See the [LICENSE](LICENSE) file for details.
