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
- [ ] `src/store/localSyncData.ts`
- [ ] persist to localStorage

## Task 5 — Zustand: profileSettings
- [ ] `src/store/profileSettings.ts`
- [ ] persist to localStorage

## Task 6 — Zustand: coreCollectionSettings
- [ ] `src/store/coreCollectionSettings.ts`
- [ ] seed defaults from `src/constants/coreCollections.ts`
- [ ] persist to localStorage

## Task 7 — Zustand: store index
- [ ] `src/store/index.ts` — re-export all stores

---

## Task 8 — Util: slugGenerator
- [ ] `src/utils/slugGenerator.ts`
- [ ] converts string to kebab-case slug

## Task 9 — Util: dateFormatter
- [ ] `src/utils/dateFormatter.ts`
- [ ] format: month+day only; add year if older than 1yr

## Task 10 — Util: hexColour
- [ ] `src/utils/hexColour.ts`
- [ ] `isValidHexColourCode(str)` — checks last 7 chars for `#RRGGBB`

---

## Task 11 — Hook: useCoreCollections
- [ ] `src/hooks/useCoreCollections.ts`
- [ ] reads `coreCollectionSettings` store
- [ ] returns 3 virtual `Collection` objects (all, untagged, trash) with `coreType` set

## Task 12 — Hook: useComboboxParser
- [ ] `src/hooks/useComboboxParser.ts`
- [ ] detect creation vs browse mode
- [ ] parse `:t:` prefix
- [ ] parse `:td:` prefix
- [ ] detect URL (http:// or https://)
- [ ] parse `::tg` tag flag
- [ ] parse `::col` collection flag
- [ ] parse `::t::`, `::link::`, `::td::`, `::itd::` type filters
- [ ] parse `##tag` tag filters
- [ ] plain text = search

---

## Task 13 — TanStack Query: query keys
- [ ] `src/db/queryKeys.ts` — centralised query key definitions

## Task 14 — TanStack Query: useItemsQuery
- [ ] fetch all non-deleted items, ordered by jottedAt desc
- [ ] pinned items sorted to top

## Task 15 — TanStack Query: useCreateItemMutation
- [ ] optimistic insert with `isPending: true`
- [ ] replace with real record on settle

## Task 16 — TanStack Query: useUpdateItemMutation
- [ ] update item in DB
- [ ] record `previousContent` if content changed (text type only)
- [ ] invalidate items query

## Task 17 — TanStack Query: useSoftDeleteItemMutation
- [ ] set `deletedAt` to now
- [ ] invalidate items query

## Task 18 — TanStack Query: useRestoreItemMutation
- [ ] clear `deletedAt`
- [ ] invalidate items query

## Task 19 — TanStack Query: useHardDeleteItemMutation
- [ ] permanently delete from DB
- [ ] invalidate items query

## Task 20 — TanStack Query: useCollectionsQuery
- [ ] fetch all collections ordered by sortOrder
- [ ] append core collections via `useCoreCollections`

## Task 21 — TanStack Query: useCreateCollectionMutation
- [ ] create collection in DB
- [ ] invalidate collections query

## Task 22 — TanStack Query: useUpdateCollectionMutation
- [ ] update collection in DB
- [ ] invalidate collections query

## Task 23 — TanStack Query: useDeleteCollectionMutation
- [ ] delete collection from DB
- [ ] invalidate collections query

---

## Task 24 — Routing
- [x] extract routes to `src/routes.tsx`
- [x] create page stub components in `src/pages/`

---

## Task 25 — JotItem: layout
- [ ] `src/components/itemComponent/JotItem.tsx`
- [ ] icon slot, primary text, secondary text, datetime

## Task 26 — JotItem: icon variants
- [ ] note icon (text default)
- [ ] hex colour swatch (text, last 7 chars valid hex)
- [ ] checkbox icon (todo)
- [ ] favicon with fallback (link)

## Task 27 — JotItem: primary and secondary text
- [ ] primary: title for text/link; content for todo
- [ ] secondary: content for text/link

## Task 28 — JotItem: datetime display
- [ ] use `dateFormatter` util

## Task 29 — JotItem: click action
- [ ] default: type-based primary action
- [ ] if `shouldCopyOnClick`: copy content to clipboard

## Task 30 — JotItem: context menu
- [ ] Radix ContextMenu wrapper
- [ ] items: Copy, Edit, Trash, Restore, Refetch, Pin, Unpin, Convert to Todo, Copy on click
- [ ] Restore only shown in trash
- [ ] Trash not shown in trash

---

## Task 31 — Combobox: input shell
- [ ] `src/components/Combobox.tsx`
- [ ] plain input with ARIA combobox attrs
- [ ] wire `useComboboxParser`

## Task 32 — Combobox: creation
- [ ] Enter submits
- [ ] route to correct mutation by parsed type
- [ ] guard: no creation in trash

## Task 33 — Combobox: tag resolution on create
- [ ] apply `::tg` tags
- [ ] apply `::col` collection tags
- [ ] apply current collection tags if `shouldApplyTagsOfCurrCollection`
- [ ] merge all tag sources, deduplicate

## Task 34 — Combobox: browse/filter
- [ ] plain text filters by content/title (case-insensitive)
- [ ] type filters (`::t::`, `::link::`, `::td::`, `::itd::`)
- [ ] tag filters (`##tag`, multiple)
- [ ] pinned items always on top

## Task 35 — Combobox: keyboard navigation
- [ ] Up/Down moves selection
- [ ] Shift+Up/Down skips 5
- [ ] mod+shift+Up/Down jumps to top/bottom
- [ ] Enter triggers primary action on selected item
- [ ] hotkeys for item actions (edit, trash, copy, etc.)

## Task 36 — Combobox: extended menu
- [ ] dropdown button on right of input
- [ ] click-accessible syntax shortcuts (`:t:`, `:td:`, type filters)

---

## Task 37 — CollectionDropdown: list
- [ ] `src/components/CollectionDropdown.tsx`
- [ ] sorted user collections + core collections
- [ ] each item: emoji, name, colour block, numeric hotkey (1-9)

## Task 38 — CollectionDropdown: layout
- [ ] desktop: top bar
- [ ] mobile: bottom-right

## Task 39 — CollectionDropdown: navigation
- [ ] click switches to collection route
- [ ] numeric hotkeys 1-9

---

## Task 40 — ItemDialog: shell
- [ ] `src/components/itemComponent/ItemDialog.tsx`
- [ ] open via `modals.open`

## Task 41 — ItemDialog: large editor (text)
- [ ] CodeMirror 6 with `standardKeymap` + `defaultKeymap`
- [ ] autosave debounced 5s
- [ ] last saved timestamp display

## Task 42 — ItemDialog: small editor (todo/link)
- [ ] textarea limited to 4 lines
- [ ] same autosave behaviour

## Task 43 — ItemDialog: Cmd/Ctrl+S
- [ ] save and close

## Task 44 — ItemDialog: tag editor
- [ ] single string input
- [ ] collapse multiple spaces on each keystroke

## Task 45 — ItemDialog: advanced accordion
- [ ] collection tag picker (highlights matching collections)
- [ ] `jottedAt` datetime picker

## Task 46 — ItemDialog: View Last Version
- [ ] button shown for text items with history only
- [ ] opens read-only dialog: content preview, `previousContentRecordedAt`
- [ ] restore button (one-way, no undo)

---

## Task 47 — CollectionDialog
- [ ] `src/components/CollectionDialog.tsx`
- [ ] name field (alphanumeric only)
- [ ] slug field (auto from name, kebab-case)
- [ ] type checkboxes (all checked by default)
- [ ] tag list
- [ ] Save / Delete buttons

---

## Task 48 — Spotlight: setup
- [ ] `src/components/Spotlight.tsx`
- [ ] flat `<Spotlight>` component, `shortcut={null}`
- [ ] open via `spotlight.open()` at app level with `mod+K`

## Task 49 — Spotlight: actions
- [ ] theme switch (system/light/dark)
- [ ] collection navigation
- [ ] switch view: collections, profile, help
- [ ] export data
- [ ] manual sync

---

## Task 50 — Header / UserDropdown
- [ ] `src/components/header/Header.tsx`
- [ ] user display name top-right
- [ ] dropdown: Settings, Manage Collections, About, Help, Privacy, ToS

---

## Task 51 — Jot page: layout
- [ ] `src/pages/Jot/index.tsx`
- [ ] Combobox at top
- [ ] item list below

## Task 52 — Jot page: pinned section
- [ ] pinned items rendered above regular items

## Task 53 — Jot page: trash notice
- [ ] banner when viewing trash: items older than 60 days are permanently deleted

## Task 54 — Jot page: onboarding banner
- [ ] shown if `shouldShowDemoDataBanner`
- [ ] dismiss sets flag to false
- [ ] load demo data button

---

## Task 55 — Collections page
- [ ] `src/pages/Collections/index.tsx`
- [ ] drag-sort list with @hello-pangea/dnd
- [ ] create, edit, delete actions
- [ ] trash always at bottom, not sortable

---

## Task 56 — Profile page
- [ ] `src/pages/Profile/index.tsx`
- [ ] user display name field
- [ ] core collection config (All, Untagged, Trash)
- [ ] sync section (connect, disconnect, status)

---

## Task 57 — Service: linkFetch
- [ ] `src/services/linkFetch.ts`
- [ ] `fetchLinkMeta(url)` — validates via `new URL(url)`
- [ ] calls `GET /api/link/fetch/?url=...`
- [ ] offline: show toast, return undefined

## Task 58 — Service: auth
- [ ] `src/services/auth.ts`
- [ ] `postAuthCallback(code)`
- [ ] `postAuthRefresh()`
- [ ] `postAuthLogout()`

## Task 59 — Sync: GIS loader
- [ ] load `https://accounts.google.com/gsi/client` script
- [ ] init code client via `window.google.accounts.oauth2.initCodeClient`

## Task 60 — Sync: auth flow
- [ ] connect button triggers GIS
- [ ] on response: POST to `/api/auth/callback` with `res.code`
- [ ] store token in `localSyncData`

## Task 61 — Sync: token refresh
- [ ] use cached token if not expired
- [ ] else POST `/api/auth/refresh`
- [ ] on failure: abort, show error

## Task 62 — Sync: folder discovery
- [ ] use cached `driveFolderId` if available
- [ ] else query Drive for `ai-jot` folder
- [ ] on `401`: nullify auth, prompt reconnect

## Task 63 — Sync: download and resolve
- [ ] download `items.json`, `collections.json`, `settings.json`
- [ ] resolve last-write-wins via `updatedAt`

## Task 64 — Sync: upload
- [ ] skip if remote is newer
- [ ] upload resolved data

## Task 65 — Sync: triggers
- [ ] debounced 15s on item/collection mutation
- [ ] manual trigger from Spotlight and Profile page
- [ ] run purge before sync

## Task 66 — Sync: disconnect
- [ ] POST `/api/auth/logout`
- [ ] nullify `localSyncData` auth fields

---

## Task 67 — Landing page
- [ ] `src/pages/Landing/index.tsx`
- [ ] app name + tagline
- [ ] feature sections (keyboard-first, jot types, indie values)

---

## Task 68 — Demo data
- [ ] `src/utils/demoData.ts`
- [ ] seed items per spec list
- [ ] seed collections per spec list
- [ ] called from onboarding banner

---

## Task 69 — Export
- [ ] export `{ items, collections, settings }` as pretty-printed JSON
- [ ] trigger from Spotlight

## Task 70 — Import
- [ ] parse JSON, validate shape
- [ ] merge into DB
- [ ] invalidate all queries

---

## Task 71 — PWA: manifest
- [ ] add icons to manifest
- [ ] verify start_url, display, theme_color

## Task 72 — PWA: offline handling
- [ ] link fetch offline: toast notification
- [ ] sync offline: reflect in syncStatus
