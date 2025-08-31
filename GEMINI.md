# GEMINI.md

## Project Overview

This project is a React-based web application that showcases a modern photo gallery with a lightbox feature. It is built with Next.js, TypeScript, and Material-UI (MUI), and uses PhotoSwipe for the gallery's lightbox functionality. The application is styled with Tailwind CSS and includes a custom image zoom component. The gallery is designed to display images from drone inspections, complete with metadata such as capture date, location, and tags.

The project is well-structured, with a clear separation of concerns between pages, components, and utilities. It also includes a comprehensive set of development tools, including Storybook for component development, Vitest for testing, and ESLint and Prettier for code quality.

## Building and Running

The project uses `pnpm` as its package manager.

### Development

To start the development server, run:

```bash
pnpm dev
```

This will start the Next.js development server on `http://localhost:3000`.

### Building

This project has two build commands:

- `pnpm build`: This command builds the Next.js application for production. The output is stored in the `.next` directory.
- `pnpm build:package`: This command uses `tsup` to bundle the project as a package, likely for distribution on npm. The output is stored in the `dist` directory.

To create a production build of the application, run:

```bash
pnpm build
```

To build the package for distribution, run:

```bash
pnpm build:package
```

### Running

To start the production server, run:

```bash
pnpm start
```

This will start the Next.js production server.

### Testing

To run the unit tests, run:

```bash
pnpm test
```

This will run the tests using Vitest.

### Storybook

To start the Storybook development server, run:

```bash
pnpm storybook
```

This will start the Storybook server on `http://localhost:6006`.

## Development Conventions

### Package Manager

This project uses `pnpm` for package management. Please use `pnpm` to install, add, or remove dependencies.

### Code Style

The project uses ESLint and Prettier to enforce a consistent code style. There are pre-commit hooks set up with Husky that will automatically lint and format your code before you commit.

You can also manually run the following commands:

- `pnpm lint`: Check for linting errors.
- `pnpm format`: Format the code with Prettier.
- `pnpm fix`: Automatically fix linting and formatting issues.
- `pnpm check`: Run all checks (type-checking, linting, and formatting).

### Component Development

Components are developed in isolation using Storybook. You can create stories for your components in the `src/components` directory.

### Styling

The project uses a combination of Material-UI (MUI) and Tailwind CSS for styling. To avoid conflicts between the two, the `important: true` option is enabled in the Tailwind CSS configuration. When styling components, it is recommended to use Tailwind CSS utility classes whenever possible.
