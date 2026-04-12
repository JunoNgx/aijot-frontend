# ai\*jot (frontend)

A minimalist keyboard-first note-taking Progressive Web App, tailored for fast operations and data-privacy. A sequel to [JustJot](https://github.com/JunoNgx/justjot-frontend).

Backend repository: [https://github.com/JunoNgx/justjot-backend]()

## Current deployment

The application is currently deployed at [aijot.app](https://aijot.app/) via Vercel.

## Features

- Keyboard-first philosophy and workflow
- Powerful main input that handles both search and quick data creation
- Three item types: text, todo, link/bookmark
- Dynamic filter-based collection system
- Privacy-focused; data exists only on area where user has control over
- Local-first: works without internet connection; changes are immediate

## Tech stack

- React via Vite
- Dexie/IndexedDB
- Zustand + TanStack Query
- Google Drive API (optional)
- CodeMirror 6

## CSS

The project's CSS uses [BEM convention](https://getbem.com/naming/) for elements' classnames with `PascalCase`, inheriting the convention used in JustJot.

```
JotItem__PrimaryText--Selected
```

This convention has improved (subjective) readability without any encountered issue. This remains in the codebase as of time of writing.

## Running locally

```
yarn
yarn dev
```

### Environment variable

TODO

## Contribution

For bug reporting, issues, and design suggestions, please open new issues on GitHub.
