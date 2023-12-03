# mtcc Frontend
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

simple front end for good user experience of mtcc.

## Requirements
mtcc frontend use [Vite](https://vitejs.dev/) for a faster and leaner development experience

## Installation
```bash
pnpm i
```

## Running the Application Locally
```bash
pnpm dev
```

## Test build mtcc
1. Build the application:
```bash
pnpm build
```
2. Serve the built application using Python's built-in HTTP server:
```bash
python3 -m http.server 8080 --directory dist
```

## Built With

This project utilizes a number of cutting-edge libraries and frameworks:

- [Vite](https://vitejs.dev/): A build tool that aims to provide a faster and leaner development experience for modern web projects. It's used with React, TypeScript, and Tailwind CSS for a better development experience.

- [shadcn/ui](https://ui.shadcn.com/): A UI library that provides a collection of pre-built components, allowing for faster and more consistent UI development.

- [Zustand](https://zustand-demo.pmnd.rs/): A small, fast and scaleable bearbones state-management solution. Has a comfy api based on hooks, isn't boilerplatey or opinionated.

- [React Hot Toast](https://react-hot-toast.com/): A library for adding customizable, beautiful toast notifications to a React application.

- [nbbcjs](https://www.npmjs.com/package/nbbcjs): A library for rendering BBCode in HTML, allowing for rich text formatting in user-generated content.

- [Lucide](https://lucide.dev/): A collection of well-designed, lightweight icons with a clean and consistent look.

- [Framer Motion](https://www.framer.com/motion/): A production-ready motion library for React that aims to make animating user interfaces a breeze.