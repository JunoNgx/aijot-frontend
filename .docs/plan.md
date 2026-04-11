# aijot-frontend — Implementation Plan

## Task 1 — Project scaffold ✅

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

---

## Task 2 — Storage interface and Dexie adapter ✅

- [x] `src/db/storage.interface.ts` — `IStorage` contract
- [x] `src/db/dexie.adapter.ts` — Dexie impl
- [x] `src/db/index.ts` — platform factory + `purgeExpiredItems`

---

## Task 3 — Zustand stores

- [ ] `src/store/localUserSettings.ts`
- [ ] `src/store/localAppData.ts`
- [ ] `src/store/localSyncData.ts`
- [ ] `src/store/profileSettings.ts`
- [ ] `src/store/coreCollectionSettings.ts`
- [ ] `src/store/index.ts` — re-export all stores

---

## Task 4 — Utils

- [ ] `src/utils/slugGenerator.ts`
- [ ] `src/utils/dateFormatter.ts`
- [ ] `src/utils/hexColour.ts` — `isValidHexColourCode`

---

## Task 5 — Hooks

- [ ] `src/hooks/useCoreCollections.ts`
- [ ] `src/hooks/useComboboxParser.ts`

---

## Task 6 — TanStack Query: items

- [ ] Query keys
- [ ] `useItemsQuery` — fetch all items
- [ ] `useCreateItemMutation`
- [ ] `useUpdateItemMutation`
- [ ] `useDeleteItemMutation` (soft delete)

---

## Task 7 — TanStack Query: collections

- [ ] `useCollectionsQuery`
- [ ] `useCreateCollectionMutation`
- [ ] `useUpdateCollectionMutation`
- [ ] `useDeleteCollectionMutation`

---

## Task 8 — Routing

- [ ] Extract routes to `src/routes.tsx`
- [ ] Create page stub components in `src/pages/`

---

## Task 9 — JotItem component

- [ ] Layout: icon, primary text, secondary text, datetime
- [ ] Icon variants: note, hex colour swatch, checkbox, favicon
- [ ] Click triggers primary action
- [ ] Context menu (Radix): Copy, Edit, Trash, Restore, Refetch, Pin, Unpin, Convert to Todo, Copy on click

---

## Task 10 — Combobox

- [ ] Input with ARIA combobox semantics
- [ ] Wire `useComboboxParser`
- [ ] Creation path (`:t:`, `:td:`, URL, default)
- [ ] Tag flags (`::tg`, `::col`)
- [ ] Browse/filter path
- [ ] Keyboard navigation (Up/Down, Shift skip, Enter)
- [ ] Extended menu (click-accessible syntax shortcuts)

---

## Task 11 — Collection dropdown

- [ ] Sorted list with emoji, name, colour, hotkey (1-9)
- [ ] Core collections always present
- [ ] Desktop (top bar) / mobile (bottom-right) layout

---

## Task 12 — Item dialog

- [ ] Large CodeMirror editor (text only)
- [ ] Small 4-line editor (todo/link)
- [ ] Autosave debounced 5s
- [ ] Cmd/Ctrl+S save and close
- [ ] Tag editor
- [ ] Advanced accordion: collection tag picker, `jottedAt` picker, View Last Version

---

## Task 13 — Collection dialog

- [ ] Name, slug (auto from name), type checkboxes, tag list
- [ ] Save / Delete

---

## Task 14 — Spotlight

- [ ] Setup `<Spotlight>` with `spotlight.open()`
- [ ] Actions: theme switch, collection nav, view switching, export, manual sync

---

## Task 15 — User dropdown + header

- [ ] User dropdown (top-right)
- [ ] Settings, Manage Collections, About, Help, Privacy, ToS links

---

## Task 16 — Jot page

- [ ] Combobox + item list
- [ ] Pinned items section
- [ ] Trash purge notice
- [ ] Onboarding banner

---

## Task 17 — Collections page

- [ ] Drag-sort list
- [ ] CRUD actions
- [ ] Trash always at bottom

---

## Task 18 — Profile page

- [ ] Display name
- [ ] Core collection config
- [ ] Sync section

---

## Task 19 — Services

- [ ] `src/services/auth.ts`
- [ ] `src/services/linkFetch.ts`
- [ ] `src/services/googleDriveSync.ts`

---

## Task 20 — Sync flow

- [ ] GIS script loader
- [ ] Auth callback + token refresh
- [ ] Folder discovery/cache
- [ ] Download, resolve, upload
- [ ] Debounced 15s auto-trigger
- [ ] Manual trigger

---

## Task 21 — Landing page

- [ ] App name, tagline
- [ ] Three feature sections

---

## Task 22 — Demo data

- [ ] `src/utils/demoData.ts` — seed items + collections per spec
- [ ] Wire to onboarding banner

---

## Task 23 — Export / import

- [ ] Export: `{ items, collections, settings }` JSON
- [ ] Import: parse + merge
- [ ] Wire to Spotlight

---

## Task 24 — PWA + offline

- [ ] PWA manifest icons
- [ ] Offline toast for link fetch
- [ ] Sync unavailable handling
