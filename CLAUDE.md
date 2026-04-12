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
- Use Mantine components where the benefit outweighs the cost of library coupling. Prefer plain HTML + SCSS for simple layout and typography where Mantine's overhead isn't worth it

## Patterns from JustJot

Reference codebase: `../justjot-frontend`. Key patterns to carry forward:

### Packages

- Radix UI for context menus and dropdowns (`@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`) — do NOT use Mantine for these
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

- Ad-hoc dialogs (edit, update): `modals.open({ children: <JSX> })`, close with `modals.closeAll()`
- Registered dialogs needing stable identity: `modals.openContextModal(...)`, registered in `ModalsProvider`
- Destructive confirmations: `modals.openConfirmModal(...)`

### Spotlight

- Pass `shortcut={[]}` to the Spotlight component to disable its built-in hotkey
- Register `mod+K` at App level via `useHotkeys(..., [])` — the `[]` second arg means "fire even when input/textarea is focused"

### Mantine quirks

- `data-autofocus={false}` does NOT disable autofocus. Pass `null` or `undefined` instead.
- Mantine's `ScrollArea` viewport ref must be used for programmatic scrolling — `window.scrollTo()` won't work if content is inside a `ScrollArea`.
- `Menu.Item` has no `data-hovered` attribute in v8. Style hover/focus with `:hover` and `:focus` CSS selectors.
- `useForm`: use `mode: 'uncontrolled'` (recommended default). `form.values` does not update reactively in this mode — read current values via `form.getValues()` inside handlers.
- `DatePicker` values are strings (`"YYYY-MM-DD"`), not `Date` objects.

### Mantine v8: Spotlight API change

`SpotlightProvider` wrapper is gone. Use flat `<Spotlight>` component with external store:

```tsx
import { Spotlight, spotlight } from '@mantine/spotlight';

<Spotlight actions={[...]} shortcut={['mod + K']} />

spotlight.open();
spotlight.close();
spotlight.toggle();
```

Pass `shortcut={null}` to disable built-in hotkey and manage manually.

### Mantine v8: no native context menu

`Menu` has no `trigger="context-menu"` in v8. Right-click menus require either Radix `ContextMenu` (chosen approach) or a manual controlled `Menu` with a zero-size anchor div at cursor position.

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

We own the color scheme logic. `themeMode` in `localUserSettings` Zustand store (`"system" | "light" | "dark"`) is the single source of truth. On change, `App.tsx` resolves `system` via `prefers-color-scheme`, sets `data-color-scheme` on `<html>`, and syncs Mantine via `setColorScheme()`. Mantine follows — it does not own the logic. When `themeMode === "system"`, a `matchMedia` change listener keeps the attribute in sync with OS changes.

CSS variables are defined under `[data-color-scheme="dark|light"]` selectors in `src/styles/_theme.scss`.

## Auth / cookies

Backend sets the refresh token via HTTP-only cookie. Frontend sends `credentials: 'include'` on all requests to the backend. No CORS configuration needed on the frontend.
