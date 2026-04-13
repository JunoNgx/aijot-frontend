# aijot-frontend — Implementation Notes

## Reference

ai\*jot is a remake of JustJot. Most of JustJot specifications are applicable to this project. JustJot is also stored as sibling directories to this project:

- Frontend: `../justjot-frontend`
- Backend: `../justjot-backend`

## Maintainer's preferences

- Use 4 space indentation
- Variable names for boolean type must always have the appropriate prefix (e.g. is-, should-, does-, has-). There is no exception.
- Do not name variables with a bare adjective (e.g. `existing`, `filtered`, `updated`). Use a noun-based name that reflects what the variable holds (e.g. `storedCategory`, `filteredTransactions`, `updatedToken`).
- Prioritise using guard clause and early termination. Avoid `else` and deeply nested codes.
- Use leading operators style for multi-line logical/binary expressions: place the operator at the start of the continuation line, not the end of the preceding one. (Not yet supported by Biome - it will reformat to trailing operators.)
- Use only `yarn` to manage packages
- Use double quotes for strings unless single quotes are required (e.g. a string containing a double quote)
- Use `camelCase` for hooks, `PascalCase` for components, and `camelCase` for all other filenames (no kebab-case)
- Constants use `SCREAMING_SNAKE_CASE` for values
- Exercise "Camel Case Acronyms"; treat acronyms and initialisms as one single word. E.g. `extractFromDb` instead of `extractFromDB`; `convertToUtc` instead of `convertToUTC`
- Use the term `Dialog` instead of `Modal`
- Complicated handler function, taking up more than one line, should be implemented separately outside of the template.
- Do not use the deprecated `FormEvent` and `React.FormEventHandler`
- Do not use em dash
- Avoid nesting by breaking down component templates to variables
- Avoid regex for implementation and usage when possible. Only use when absolutely necessary or the benefit is significant.
- Implement reusable utility CSS classes in `global.scss` as needed rather than repeating inline styles
- CSS custom properties (variables) use `camelCase` (e.g. `--colBg`, `--colTextMuted`)
- Use CSS variables when possible, especially for common patterns (e.g. `var(--lineThickness)` instead of `1px`). Variables are defined in `src/styles/_vars.scss`
- Run `yarn format` after every set of changes before handing back
- Use plain HTML + SCSS for all UI. Use Radix UI primitives where accessibility behaviour is non-trivial (e.g. dialogs, accordions, context menus, dropdowns)

## Patterns from JustJot

Reference codebase: `../justjot-frontend`. Key patterns to carry forward:

### Packages

- Radix UI for accessible primitives: context menus (`@radix-ui/react-context-menu`), dropdowns (`@radix-ui/react-dropdown-menu`), dialogs (`@radix-ui/react-dialog`), accordions (`@radix-ui/react-accordion`)
- `@hello-pangea/dnd` for drag-and-drop (collection sort)
- `luxon` for date formatting
- `@tabler/icons-react` for icons

### Hook architecture

Two-layer split for all data operations:

- `useXxxApiCalls`: raw DB/API calls only. No UI state, no notifications. Accepts `successfulCallback?`, `errorCallback?`, `setLoadingState?`.
- `useXxxActions`: calls API layer, handles optimistic updates, error recovery, notifications, dialog opening.

### Navigation

- `useNavigateRoutes` hook: all `navigate()` calls centralised here. No inline `navigate()` in components.
- Route guard as a render-less `<NavigationHandler>` component (uses `useLocation` + `useEffect`). Avoids React Router loader/guard patterns.

### Collection sort order

- Floating-point midpoint insert: `(prev.sortOrder + next.sortOrder) / 2`
- Prepend: `first.sortOrder - 1000`
- Append: `last.sortOrder + 1000`
- Increment constant: 1000

### Dialogs

- Ad-hoc dialogs: `useDialogStore.getState().openDialog({ children: <JSX> })`, close with `closeAllDialogs()`
- `<DialogManager>` in `main.tsx` renders the active dialog via Radix `Dialog.Root`
- Destructive confirmations: use `modals.openConfirmModal(...)` pattern — not yet implemented, use a dedicated dialog component when needed

### Hotkeys

- Global hotkeys: `useHotkeys` with `{ enableOnFormTags: true }`
- Inline `onKeyDown` hotkeys: `getHotkeyHandler(tuples)` from `src/utils/hotkeyHandler.ts`
- Shortcut format: `"mod+key"`, `"shift+key"`, `"mod+shift+key"` — `mod` = Ctrl on Windows/Linux, Cmd on Mac

### `isPending` guard

Optimistic items get an `isPending: true` flag. All mutation operations check this and bail early with a notification if true. Prevents acting on unconfirmed items.

### Combobox extended menu

`MainInputExtendedMenu`: a dropdown button on the right of the input providing click-accessible versions of syntax shortcuts. Mirrors keyboard-only syntax for mouse/touch users.

### iOS long-press

Radix `ContextMenu` handles iOS long-press natively. No custom shim needed.

### `useManageListState`

Generic hook returning `{ prepend, append, pop, remove, insert, replace, replaceProps }` for immutable array state mutations. Worth porting as a utility.

---

## Storage abstraction

All DB access goes through `src/db/storage.interface.ts` (`IStorage`).

- Web: Dexie (IndexedDB) adapter at `src/db/dexie.adapter.ts`
- Electron (future): SQLite adapter (e.g. better-sqlite3) at `src/db/sqlite.adapter.ts`
- `src/db/index.ts` exports a platform factory — returns the correct adapter based on runtime env

**Rule: no component or hook imports Dexie directly. All access via the IStorage interface.**

## Data fetching

TanStack Query wraps all data access including local DB reads.

- Reads: `useQuery` / `useInfiniteQuery` backed by IStorage methods
- Writes: `useMutation` + manual `queryClient.invalidateQueries`

## Technical decisions

### Color scheme

We own the color scheme logic. `themeMode` in `localUserSettings` Zustand store (`"system" | "light" | "dark"`) is the single source of truth. On change, `App.tsx` resolves `system` via `prefers-color-scheme` and sets `data-color-scheme` on `<html>`. When `themeMode === "system"`, a `matchMedia` change listener keeps the attribute in sync with OS changes.

CSS variables are defined under `[data-color-scheme="dark|light"]` selectors in `src/styles/_theme.scss`.

## Auth / cookies

Backend sets the refresh token via HTTP-only cookie. Frontend sends `credentials: 'include'` on all requests to the backend. No CORS configuration needed on the frontend.
