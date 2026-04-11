# aijot-frontend — Implementation Plan

## Task 1 — Project scaffold

- Init Vite + React + TypeScript
- Install: Mantine 8, `@mantine/hooks`, `@mantine/dates`, Zustand, TanStack Query, Dexie, React Router v6, CodeMirror 6 (`@codemirror/view`, `@codemirror/commands`), `vite-plugin-pwa`, SCSS
- `global.scss` at root, BEM pascal-case convention established
- `src/types.ts`: all shared types (`Item`, `Collection`, `ItemType`, `CoreCollectionType`, store shapes)
- `src/constants/`: `terminology.ts` (SOFT_DELETE_PURGE_DURATION_DAY=60), `keyboard-shortcuts.ts`, `core-collections.ts`

---

## Task 2 — Data layer

### Storage abstraction (`src/db/`)

```
storage.interface.ts   <- IStorage contract
dexie.adapter.ts       <- Dexie impl of IStorage
index.ts               <- platform factory (returns correct adapter)
```

- `items` table: all fields per spec; indexes on `id, type, jottedAt, deletedAt, *tags`
- `collections` table; indexes on `id, sortOrder, slug`

### Zustand stores (`src/store/`)

- `localUserSettings`: themeMode
- `localAppData`: shouldShowDemoDataBanner
- `localSyncData`: authToken, driveFolderId, lastSyncTime, syncStatus, syncError
- `profileSettings`: userDisplayName, shouldApplyTagsOfCurrCollection
- `coreCollectionSettings`: names/slugs/emojis/colours for Trash, All, Untagged

---

## Task 3 — Core business logic

### Hooks (`src/hooks/`)

- `useCoreCollections`: builds 3 virtual collection objects from `coreCollectionSettings`, appends to DB results
- `useComboboxParser`: parses raw input string into `{ type, content, title, tags, colSlug, filterType, filterTags, searchText }`

### Utils (`src/utils/`)

- `slugGenerator.ts`
- `dateFormatter.ts`: month+day; show year if older than 1 year
- `constants.ts`: BACKEND_URL, etc.

### Soft delete / purge

- `purgeExpiredItems()`: hard-delete where `deletedAt < now - 60d`
- Trigger on `visibilitychange` event in App root; also triggered at sync

### Previous version recording

- On any `content`-changing update to text items: write `previousContent` + `previousContentRecordedAt`

---

## Task 4 — Services (`src/services/`)

- `auth.ts`: `postAuthCallback(code)`, `postAuthRefresh()`, `postAuthLogout()`
- `linkFetch.ts`: `fetchLinkMeta(url)` returning `{ title, faviconUrl }`; validates via `new URL(url)`; toast on offline
- `googleDriveSync.ts`:
    - GIS script loader
    - Folder discovery/cache
    - Download, resolve (last-write-wins via `updatedAt`), upload
    - `401` handler: nullify auth
    - Debounced 15s auto-trigger on item/collection mutations
    - Manual trigger support

---

## Task 5 — Routing (`src/routes.tsx`)

```
/               -> Landing
/jot            -> Jot (all items)
/jot/:slug      -> Jot (collection filtered)
/collections    -> Collections management
/profile        -> Profile/Settings
/help           -> Help
/privacy        -> Privacy
/terms          -> Terms
```

---

## Task 6 — Shared UI components (`src/components/`)

### Combobox

- Parse input via `useComboboxParser`
- Creation path: `:t:` opens TextDialog, `:td:` creates todo, URL detected creates link, default creates text
- Tag flags: `::tg`, `::col`, both combined
- Browse path: plain text searches content/title; `::t::` / `::link::` / `::td::` / `::itd::` filter by type; `##tag` filters by tag
- Multiple `##tag` filters supported simultaneously
- Up/Down arrow navigation; Shift+Up/Down skips 5 items
- Pinned items honoured during search
- Guard: creation disabled in trash

### JotItem

- Icon: hex colour block (if last 7 chars are valid hex, text only), checkbox, favicon with fallback, note icon
- Primary text: title for text/link; content for todo
- Secondary text: content for text/link
- Datetime: formatted per spec (month+day; year if older than 1yr)
- Context menu (right-click / long-press): Copy, Edit, Trash, Restore, Refetch, Pin, Unpin, Convert to Todo, Copy on click
- Click triggers primary action; copy if `shouldCopyOnClick` is true
- List not tabbable; controlled via combobox only

### CollectionDropdown

- Desktop: top bar; mobile: bottom-right
- Sorted list with emoji, name, colour, numeric hotkey (1-9)
- Always includes All, Untagged, Trash core collections

### TextDialog / ItemDialog

- Large CodeMirror 6 editor (text type only) using `standardKeymap` and `defaultKeymap`
- Small 4-line editor for todo/link
- Autosave debounced 5s; last saved timestamp always visible
- Cmd/Ctrl+S: save and close
- Tag editor: single string, whitespace-separated, collapses multiple spaces on each keystroke
- Advanced accordion:
    - Collection-based tag picker (collections highlighted when tag criteria met)
    - `jottedAt` datetime picker
    - View Last Version button (text only, when history available): opens read-only dialog with preview, `previousContentRecordedAt`, close and restore buttons

### CollectionDialog

- Name (alphanumeric only), slug (auto-derived from name in kebab-case), type checkboxes (all checked by default), tag list
- Save / Delete buttons

### Spotlight

- Activated via Cmd/Ctrl+K anywhere in app
- Actions: switch theme, navigate to collection, switch view (collections, profile, help), export data, manual sync

### UserDropdown

- Located top-right
- Access: Settings, Manage Collections, About, Help, Privacy, Terms of Service

---

## Task 7 — Pages (`src/pages/`)

### Landing

- App name and tagline: `*sloth, not artificial intelligence`
- Hook 1: `ai` as three-toed sloth
- Hook 2: `jot` as quickly record something
- Feature 1: keyboard-first workflow
- Feature 2: multiple jot types
- Feature 3: free forever, open source, data ownership, no tracking

### Jot (`/jot` and `/jot/:slug`)

- Combobox at top
- Pinned items section above regular items list
- Trash: notice that items older than 60 days are permanently deleted
- Onboarding banner (shown if `shouldShowDemoDataBanner`)

### Collections

- List of user collections with drag-sort
- CRUD: create, edit, delete
- Trash not sortable, always listed separately at bottom

### Profile

- User display name
- Sync config and manual sync trigger
- Core collection settings (All, Untagged, Trash)

---

## Task 8 — PWA + offline

- `vite-plugin-pwa`: manifest (name, icons, start_url `/jot`, display standalone)
- Service worker: cache app shell
- Offline: link fetch fails shows toast; sync unavailable reflected in sync status

---

## Task 9 — Demo data (`src/utils/demoData.ts`)

Seed function inserting items and collections per spec. Triggered from onboarding banner (opt-in only).

---

## Task 10 — Export / import

- Export: single JSON `{ items, collections, settings }`, pretty-printed
- Import: parse same shape, merge into DB
- Accessible via Spotlight

---

## Recommended build order

```
1 -> 2 -> 3 -> 5 -> 6 (JotItem + Combobox) -> 7 (Jot page) -> 4 -> 6 (Dialogs) -> 8 -> 9 -> 10
```

Get the core read/write loop working first (DB -> list -> combobox create -> display), then layer services and sync.
