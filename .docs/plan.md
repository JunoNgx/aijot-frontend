# aijot-frontend — Implementation Plan

## Task 1 — Project scaffold

- [x] Init Vite + React + TypeScript
- [x] Set up yarn v4 with node-modules linker
- [x] Install all dependencies
- [x] `postcss.config.cjs` for Mantine
- [x] `vite.config.ts` with PWA plugin
- [x] `src/styles/global.scss`
- [x] `src/theme.ts`
- [x] `src/types.ts`
- [x] `src/constants/misc.ts`
- [x] `src/constants/coreCollections.ts`
- [x] `src/constants/keyboardShortcuts.ts`
- [x] `src/main.tsx` with all providers
- [x] `src/App.tsx` stub with routes and purge trigger
- [x] `src/db/storage.interface.ts`
- [x] `src/db/dexie.adapter.ts`
- [x] `src/db/index.ts` — platform factory + `purgeExpiredItems`

---

## Task 2 — Zustand: localUserSettings

- [x] `src/store/localUserSettings.ts`
- [x] persist to localStorage

## Task 3 — Zustand: localAppData

- [x] `src/store/localAppData.ts`
- [x] persist to localStorage

## Task 4 — Zustand: localSyncData

- [x] `src/store/localSyncData.ts`
- [x] persist to localStorage

## Task 5 — Zustand: profileSettings

- [x] `src/store/profileSettings.ts`
- [x] persist to localStorage

## Task 6 — Zustand: coreCollectionSettings

- [x] `src/store/coreCollectionSettings.ts`
- [x] seed defaults from `src/constants/coreCollections.ts`
- [x] persist to localStorage

## Task 7 — Zustand: store index

- [won't do] `src/store/index.ts` — re-export all stores

---

## Task 8 — Utils

- [x] `src/utils/slugGenerator.ts` — string to kebab-case
- [x] `src/utils/dateFormatter.ts` — month+day; year if older than 1yr
- [x] `src/utils/hexColour.ts` — `isValidHexColourCode(str)` checks last 7 chars

---

## Task 9 — Items query layer

- [x] `src/db/queryKeys.ts` — centralised query key constants
- [x] `useItemsQuery` — non-deleted items, jottedAt desc, pinned first
- [x] `useCreateItemMutation` — optimistic insert with `isPending: true`

---

## Task 10 — useCoreCollections + collections query

- [x] `useCoreCollections` — builds 3 virtual collections from store with `coreType`
- [x] `useCollectionsQuery` — DB collections + core collections appended

---

## Task 11 — JotItem component

- [x] layout: icon, primary text, secondary text, datetime
- [x] icon variants: note, hex swatch, checkbox, favicon with fallback
- [x] primary text: title for text/link; content for todo
- [x] secondary text: content for text/link
- [x] datetime via `dateFormatter`
- [x] click: primary action or copy if `shouldCopyOnClick`

---

## Task 12 — Jot page MVP

- [x] Combobox input with inline parsing
- [x] creation: Enter submits, routes by parsed type, tag resolution, guard in trash
- [x] item list via `useItemsQuery`
- [x] plain text search + type/tag filters applied to list

---

## Task 13 — useComboboxParser

- [x] extract inline parsing logic to `src/hooks/useComboboxParser.ts`
- [x] detect creation vs browse mode
- [x] parse `:t:`, `:td:` prefixes; detect URL
- [x] parse `::tg`, `::col` tag flags
- [x] parse `::t::`, `::link::`, `::td::`, `::itd::` type filters
- [x] parse `##tag` filters; plain text = search

---

## Task 14 — Combobox: keyboard nav + hotkeys

### State

- [x] `selectedIndex` lifted to `Jot/index.tsx`, passed to `MainInput` and `JotItem` (for selected styling)
- [x] `selectedIndex` resets to `-1` on input change

### Navigation (handled in `MainInput` via `getHotkeyHandler`)

- [x] `ArrowUp` / `ArrowDown` — move selection by 1
- [x] `Shift+ArrowUp` / `Shift+ArrowDown` — move selection by 5
- [x] `mod+Shift+ArrowUp` / `mod+Shift+ArrowDown` — jump to top/bottom
- [x] `Escape` — clear selection (set to `-1`)
- [x] `mod+f` — focus main input from anywhere in the app (registered at `Jot` level)

### Item hotkeys (only fire when `selectedIndex > -1`)

- [x] `mod+Enter` — trigger primary action on selected item (link: open, todo: toggle done, text: open ItemDialog stub)
- [x] `mod+shift+c` — copy selected item content to clipboard
- [x] `mod+e` — open ItemDialog (stub until task 18)

## Task 14b — Extended menu

- [ ] extended menu: click-accessible syntax shortcuts

---

## Task 15 — Remaining item mutations

- [x] `useUpdateItemMutation` — saves `previousContent` if content changed (text only)
- [x] `useSoftDeleteItemMutation`, `useRestoreItemMutation`, `useHardDeleteItemMutation`

## Task 15b — Mutation hotkeys (blocked by task 15)

- [ ] `mod+shift+backspace` — trash selected item
- [ ] `mod+alt+r` — restore selected item, trash only
- [ ] `mod+alt+4` — toggle copy-on-click
- [ ] `mod+alt+5` — refetch link meta, links only
- [ ] `mod+alt+6` — convert to todo, text only

---

## Task 16 — JotItem context menu

- [x] Radix ContextMenu: Copy, Edit, Trash, Restore, Permanently Delete, Refetch, Pin, Unpin, Convert to Todo, Copy on click
- [x] Restore + Permanently Delete only in trash; Trash hidden in trash

---

## Task 17 — Jot page: pinned section, trash notice, onboarding banner

- [x] pinned items rendered above regular list
- [x] onboarding banner: shown if `shouldShowDemoDataBanner`, dismiss + load demo data

---

## Task 18 — ItemDialog

- [x] shell via `modals.open`
- [x] CodeMirror 6 editor (text) + small 4-line editor (todo/link)
- [x] autosave debounced 5s + last saved timestamp
- [x] Cmd/Ctrl+S save and close
- [x] tag editor: single string, collapse spaces on keystroke

---

## Task 19 — ItemDialog: advanced accordion

- [x] `jottedAt` datetime picker
- [x] View Last Version: read-only editor with restore button (text only)

---

## Task 19-2a — Mantine removal: setup + teardown

Remove all Mantine packages: `@mantine/core`, `@mantine/dates`, `@mantine/hooks`, `@mantine/modals`, `@mantine/notifications`, `@mantine/spotlight`, `@mantine/form`.

- [x] Install `@radix-ui/react-accordion`, `sonner`, `react-hotkeys-hook`
- [x] `src/hooks/useDebounced.ts` — custom debounce hook to replace `useDebouncedCallback`
- [x] Remove `MantineProvider`, `ModalsProvider`, `Notifications` from `main.tsx`; remove all `@mantine/*` CSS imports
- [x] Remove `postcss-preset-mantine` from `postcss.config.cjs`

---

## Task 19-2b — Mantine removal: dialog system

- [x] `src/store/dialogStore.ts` — plain Zustand store (no `persist`) with `openDialog({ children })` / `closeAllDialogs()`
- [x] `src/components/DialogManager.tsx` — Radix `Dialog` root consuming the store
- [x] Mount `<DialogManager>` in `main.tsx`
- [x] Replace all `modals.open(...)` call sites with `openDialog(...)`
- [x] Replace all `modals.closeAll()` call sites with `closeAllDialogs()`

---

## Task 19-2c — Mantine removal: ItemDialog surgery

- [x] Replace `Accordion` with `@radix-ui/react-accordion`
- [x] Replace `DateTimePicker` with `<input type="datetime-local">`
- [x] Replace `useDebouncedCallback` with `useDebounced`
- [x] Replace `Button`, `TextInput`, `Textarea` with plain HTML + SCSS

---

## Task 19-2d — Mantine removal: hotkeys + notifications + cleanup

- [x] Replace `getHotkeyHandler` + `useHotkeys` with `react-hotkeys-hook`
- [x] Wire sonner: add `<Toaster>` to `main.tsx`, replace all `notifications.show(...)` calls
- [x] Remove `theme.ts`; remove `useMantineColorScheme` from `App.tsx`
- [x] Uninstall all `@mantine/*` packages

---

## Task 19-3 — Firefox datetime picker fallback

- [ ] Detect Firefox via user agent or feature detection
- [ ] Render fallback UI (separate date + time `<input>` fields, or custom picker) when native `datetime-local` is inadequate
- [ ] Reconcile fallback output back to ISO string for consistent value handling

---

## Task 20 — Collection mutations + CollectionDialog

- [ ] `useCreateCollectionMutation`, `useUpdateCollectionMutation`, `useDeleteCollectionMutation`
- [ ] CollectionDialog: name, slug (auto), type checkboxes, tag list, Save/Delete

---

## Task 21 — CollectionDropdown

- [ ] sorted list: emoji, name, colour, numeric hotkey (1-9)
- [ ] core collections always present
- [ ] desktop: top bar; mobile: bottom-right
- [ ] click + numeric hotkeys navigate to collection
- [ ] trash notice: notice items older than 7 days are soft deleted

---

## Task 22 — Collections page

- [ ] drag-sort with `@hello-pangea/dnd`
- [ ] create, edit, delete via CollectionDialog
- [ ] trash always at bottom, not sortable

---

## Task 23 — Header + UserDropdown + Spotlight

- [ ] Header with user display name top-right
- [ ] UserDropdown: Settings, Manage Collections, About, Help, Privacy, ToS
- [ ] Spotlight: setup + actions (theme, nav, export, sync)

---

## Task 24 — Routing

- [x] extract routes to `src/routes.tsx`
- [x] create page stub components in `src/pages/`

---

## Task 25 — Profile page

- [ ] user display name, core collection config, sync section (connect/disconnect/status)

---

## Task 26 — linkFetch service

- [ ] `fetchLinkMeta(url)` — validates via `new URL(url)`, calls backend
- [ ] offline: toast + return undefined
- [ ] wire to item create/refetch

---

## Task 27 — Export + Import

- [ ] export `{ items, collections, settings }` pretty-printed JSON
- [ ] import: parse, merge into DB, invalidate queries
- [ ] wire to Spotlight

---

## Task 28 — PWA

- [ ] manifest icons
- [ ] offline: link fetch toast, sync status handling

---

## Task 29 — Landing page

- [ ] app name + tagline, three feature sections

---

## Task 30 — Demo data

- [x] `buildDemoItems()` in `src/utils/itemFactory.ts` — seed items per spec
- [x] wire to onboarding banner
- [ ] seed collections per spec

---

## Task 31 — Auth + Google Drive sync

- [ ] `src/services/auth.ts`: postAuthCallback, postAuthRefresh, postAuthLogout
- [ ] GIS script loader + initCodeClient
- [ ] token refresh flow; folder discovery/cache
- [ ] download → resolve (last-write-wins) → upload
- [ ] debounced 15s trigger + manual trigger + disconnect

---

## Task 32 — Post-release polish

- [ ] Collection tag picker in ItemDialog: highlights collections whose tags match the item's tags
