# Specification for ai*jot frontend

## Overview

A minimal keyboard-first note-taking application with a focus on quick keyboard-driven input workflow, offline functionality, and data ownership.

## Tech stack
- React on Vite
- IndexedDB via Dexie for data persistence
- Zustand and TanStack Query for state management
- Mantine 8 as UI library
- Google Drive API for cloud backup storage
- CodeMirror 6 for heavy text editing
    - `standardKeymap` and `defaultKeymap`
- CSS: SCSS
    - BEM convention with pascal case (e.g. `JotItem__PrimaryText--Selected`)
    - `global.scss` at root
    - Each component has a co-located module scss file `*.module.scss`
- Backend is implemented elsewhere

## Platform
- Web application
- Progressive Web App
- Electron app (under consideration)
    - This project should be implemented with abstraction to allow easy implementation of native app layers, if decided to

## Backend

Backend is deployed at `https://aijot-backend.vercel.app`, consisting of the following endpoints:

- Google auth flow
    - POST `/api/auth/callback`
    - POST `/api/auth/refresh`
    - POST `/api/auth/logout`
- Link fetch
    - GET `/api/link/fetch/` for fetching link-type title and favicon url.
        - Request param: `url`: link must be correctly formatted and appended with protocol correctly by client (passing `new URL(url)`) upon being sent
        - Response format `{ title, faviconUrl }`

## Terminology

SOFT_DELETE_PURGE_DURATION_DAY = 60

### Item
- The primary data storage item, can be either
    - Plain text: can have optional title
    - Todo item: uniquely have isTodoDone state
    - Bookmark/url: uniquely have faviconUrl for ui display
- Items can have one or many `tags`
- Items exist in one flat pool and do not belong to any collection

### Collection
- A set of filter configuration to display items that meet the criteria. Can be used as a folder, but is not a folder.
- Filter configuration include
    - Item tag
    - Item type
- An item would be required to have ALL the tags and is one of the selected types, set in the collection to meet the criteria to be displayed

### Tag
- Can be attached to each Jot to allow them to be collated in a `Collection`.

## Functional requirement

### Authentication/User profile
- User can immediately use the app without any logging in

### Data processing
- CRUD operations for the three data models
- Url upon input, will immediately fetch page title and favicon
- Plain text without title can be converted into a Todo item

### Combobox input
The central UI component of the app, capable of:
- Creating new Jots by type
- Filter Jots in the Page by type
- Filter Jots in the Page by tag

## Data schema

### Table `items`
- `id`: uuid
- `createdAt`: iso timestamp, metadata
- `jottedAt`: iso timestamp, user-editable for display purpose
- `updatedAt`
- `deletedAt`: for soft-deletion
- `title`
- `content`: plain-text only
- `type`: ItemType
- `isDone`
- `faviconUrl`: `link` only
- `shouldCopyOnClick`: boolean
- `isPinned`
- `tags`: string[]
- `previousContent`, last saved content, for undo'ing purpose
- `previousContentRecordedAt`: iso-timestamp for `previousContent`

- ItemType: `text` | `todo` | `link`

Fields to index: id, type, jottedAt, deletedAt, *tags

### Table `collections`
- `id`: uuid
- `createdAt`
- `updatedAt`
- `name`: alphanumeric only, case-sensitive
- `icon`: string; one single char of icon emoji
- `colour`: string; hex colour code
- `slug`: must be unique
- `sortOrder`
- `tags`: string[]
- `types`: string[] of `ItemType`

- `coreType?`: `all | untagged | trash`
    - not stored in DB, but should be specified for TS typing, to differentiate the three core collections.

Fields to index: id, sortOrder, slug

<!-- ### Table `tags`
- `name`: single word alphanumeric only, no special characters except for dash. Words with dash are still considered single word.
- `count`: TODO: under consideration -->

## Routing

- `/`: root; landing page
- `/jot`: home page; default page for pwa
    - Alias for all items
- `/jot/:slug`: route to specific collection by slug
- `/collections`: Manage collection menu
- `/profile`: Profile

## Persistent app data stores

Stores that are prefixed with `local*` are for local use only and never synced.

#### `localUserSettings`
- themeMode: "system" | "light" | "dark"

#### `localAppData`
- shouldShowDemoDataBanner: related to Demo Data section, would be `false` after dismissed by user.

#### `localSyncData`
- authToken: store the access token after access to Google Drive was granted by user
    - id: "google"
    - accessToken
    - expiresAt
    - email
- driveFolderId: the id of the `aijot` folder from user's Google Drive, to reduce the amount of requests back and forth
- lastSyncTime: to trigger auto sync when current data is stale
- syncStatus: "idle" | "syncing" | "error"
- syncError: store error from sync upon issue encountered


### `profileSettings`
- userDisplayName: to display user name on the navbar, top right corner
- shouldApplyTagsOfCurrCollection: boolean, true by default. When checked, when viewing a collection, creating new items will automatically apply the tags associated with this collection.

### `coreCollectionSettings`
- Trash bin settings:
    - Name: `Trash` by default
    - Slug: `trash` by default
    - Emoji: wastebasket by default
    - Colour: muted red
- All collections settings:
    - Name: `everything` by default
    - Slug: `all` by default
    - Emoji: box by default
    - Colour: light grey
- Uncategorised settings:
    - Name: `Untagged` by default
    - Slug: `untagged` by default
    - Emoji: tag by default
    - Colour: warm amber
- Also, build system collection getters

## User interface

### Landing page
- Showing app name
- Tagline: `*sloth, not artificial intelligence`
- Hook 1: `ai` as `three-toed sloth`
- Hook 2: `jot` as quickly record something
- Feature 1: be more like sloth; achieve more with less movement
    - Keyboard is powerful

- Feature 2: Your everyday notebook
    - Multiple jot types

- Feature 3: all the indie goodies
    - Free forever
    - Open source
    - You own your data
    - No tracking or data collection

### Main view

#### Combobox
The central UI component of the app, behaviours depend on the content and context

##### Creation
- Creating is always performed by entering the input with the Enter key.
- Uses a cmd flag-like system to differentiate types
    - `:t:` for text with title, will trigger `TextDialog`
    - `url` type is automatically detected by detecting the URL shape with http:// or https://
        - Created link will also be sent to endpoint `linkFetch` for update
    - `:td:` for checkbox item
- Always create a text as a failsafe default action
- Creating item is not possible for trash bin (implemented as a guard check)

##### Tagging creation

###### By tags
- Tags are flagged with `::tg`, and should be kept as the last part of the syntax. Tag should be separated with space.
- Examples:
    - `#A84B34 ::tg red` will create a short note with content `#A84B34` with tag `red`
    - `JunoNgx.com ::tg portfolio minimal` will create an link item with tag `portfolio` and `mininal`
    - `:t: Screenplay draft ::tg thriller scifi` will open the create text dialog with `Screenplay draft` filled for title, and tags filled with `thriller` and `scifi`

###### By collection
- Tags can also be tagged by collection basis with the flag `::col`, followed by the slugs of the collection that the user wants it to be associated with. This should also be kept behind the content.
- Consider the scenario:
    - Collection `Screenplays` with the slug `screenplays`, which has the tags `creative`, `writing`, and `screen`
    - Collection `Scifi` with the slug `scifi`, which has the tags `scifi`
    - Entering `:t: Untitled scifi thriller draft ::col screenplays scifi` will also apply the following tags:
        - `creative`, `writing`, `screen` as the result of the first indicated collection `Screenplays`
        - `scifi` as the result of the second indicated collection `Scifi`

###### By both tags and collection
- Both of these flags can be used together, and it doesn't matter which one come first. The specified tags and the tags used by the collection will all be applied together to the item

###### While viewing a collection
- This will take effect even if currently viewing a collection, in addition to `shouldApplyTagsOfCurrCollection`.
- Example
    - `shouldApplyTagsOfCurrCollection` is true
    - Current viewing collection `col1` with tags `tag1 tag2`
    - `col2` exists with `tag3 tag4`
    - User enter input `abcdef ::col col2 ::tg tag5`
    - Item will be created with tag1 and tag2 (under `shouldApplyTagsOfCurrCollection` effect); tag3 and tag4 (specified by flag `::col col2`); and tag5 (specified by flag `::tg tag5`)

##### Browsing items
- By default, combobox with `$inputContent` will search for content or title contains `$inputContent`, case-insensitive within the current collection
- Pinned status is still honoured while searching
- Filter Jots in the page by type:
    - Syntax is intentionally verbose to avoid clashing with actual content of the Jots
    - `::t::` for text type
    - `::link::` for link types
    - `::td::` for all todo types
    - `::itd::` for incomplete todo types
    - `::ctd::` for completed todo types

- Filter Jots in the Page by tag:
    - `##${tagName}`
    - Multiple tags can be filtered at once

##### Control
- While combobox is focused, up and down arrow can be used to browse through the items
    - Use Shift + Up/Down to move by 5 items
- Highlighted items can have actions performed on using hotkey shortcuts

#### Jot item
- Displayed Jot items, if passed filtered, are displayed in a list
    - Pinned items are always displayed on top of the list, whether globally or in a collection
- Jot item list is not tabbable, and is only controlled via the main combobox
- Clicking on an item will trigger primary action:
    - Text: open TextDialog
    - Todo: toggle `isTodoDone` state
    - Link: open the link in a new tab
    - Primary action can be `Copy content` if `shouldCopyOnClick` is true, copying the content of the item

##### Icon
- Pre-set note icon for text
- A block of hex colour if the last 7 characters are a valid hex colour code preceded with the hash sign (text note only)
- Checkbox icon for todo items
- Favicon for links, or default icon if not available or not valid

##### Primary text
- Highlighted, using primary text colour
- Shows `title` content for text and link
- Show `content` for todo item

##### Secondary text
- Dimmed, using grey
- Shows `content` for text or link (which is typically link content)

##### Jotted datetime
- Shows absolute date in month and day only
- Shows year if older than a year

##### Context menu options
Long-press on mobile; right mouse click on desktop.

Might require a solution to workaround iOS
- Copy
- Edit
- Move collection: under consideration, probably comes with too much complexity?
- Trash
- Restore: from Trash bin only
- Refetch
- Pin item
- Unpin item
- Convert to Todo
- Copy on click

#### Collection Dropdown

##### Location
- Top bar when in desktop layout
- Bottom lower right corner in mobile layout

##### Functionalities: switching collection
- Display collections in the sequence sorted in settings
- Each collection item is displayed with:
    - Emoji icon
    - Name
    - Colour block
    - Numeric hotkey to switch to, applicable only to the first 9 collections
- Special items in the list, always present:
    - All items (user configurable)
    - Uncollated items
    - Trash bin (user configurable)

### User dropdown

Displayed on the top right corner, clicking will trigger a dropdown to access other configuration menu

#### Settings
Configuration for:
- User display name
- Sync config/manual sync
- All items collection
- Untagged collection
- Trash bin

Extra information for
- About
- Help/Manual
- Privacy policy
- Terms of Service

#### Manage Collections
- Collections can be custom sorted here
- Trash bin is not sortable, and is always listed at the bottom, separatedly
- CRUD operations for collections:
    - Create new one
    - Edit existing one
    - Delete existing one

### Spotlight/Command palette

Spotlight control, activated with Cmd/Ctrl + K, is accessible anywhere in the app. Can be used for:
- Switch user theme mode (system, light, dark)
- Collection navigation
- Switch view to:
    - Collection management
    - Profile settings
    - Help
- Export data
- Manual sync

#### Item create/edit dialog
Fields to edit:
- Title
- Large text editor:
    - Only applicable to text type
    - Interface should use CodeMirror 6 using standard and default keymap
    - Edits are autosaved, debounced to 5s
- Small text editor:
    - Applicable to TODO and link
    - Limited to 4 lines only
    - Same saving behaviour as large text editor
- Last saved timestamp is always displayed below the editor
    - Keyboard prompt: Cmd/Ctrl + S for `Save and close`
- Input field for tag edit:
    - Represented by a single string
    - Each tag is separated by whitespace
    - Each keystroke will re-format and collapse multiple whitespaces into single one
- Button:
    - Save
    - Delete

##### Advanced settings: accessed by toggling an accordion
- Setting tag by collection, below the tag input
    - Display list of collection
    - Selecting/deselecting tag will add/remove associated tag from the input
    - Collection will be highlighted accordingly upon meeting the tag criteria
- `jottedAt`: Datetime picker
- `View last version` button
    - Only available for text, when history is available
    - Will open another read-only dialog:
        - Content preview
        - `previousContentRecordedAt`
        - Buttons: `close` and `restore version`
        - This is a one-way operation with no undo

#### Collection create/edit dialog
- Name: alphanumeric only
- Slug: auto calculated and transformed name into kebab case upon name change
- Checkboxes for three types of items; always checked all by default upon creation
- List of tag pickers
    - User prompt: Item displayed under this collection is required to have ALL the following tags
- Buttons:
    - Save
    - Delete

## Other business logic

### Core collections
All users have three mandatory system collections that are not deletable:
- Everything
- Untagged
- Trash bin

These are not real collections and are derived from `coreCollectionSettings`, then built into collection-shaped objects (with `coreType`) and appended into db query results.

### Soft deletion
- Items can only be soft-deleted, set at `deletedAt`
- Soft deleted items are viewed via TrashBin collection
    - The collection should display a notice on top the logic that items older than SOFT_DELETE_PURGE_DURATION_DAY will be permanently deleted
- Item is purged/hard-deleted if deletedAt is older than SOFT_DELETE_PURGE_DURATION_DAY
- Purge occurs at `visibilitychange` when user access the app AND at sync

### Previous version recording
- Applicable to text items only
- Recording is triggered upon any update that also changes the item's `content`.

## Sync behaviour

Sync is triggered debounced to 15s, after the user has made a change to `items` or `collection`. User can also manually sync.

### Sync flow

#### Connecting to Google/Authorization code flow
- User clicks on Connect to Google button in settings
- Check environment variable for `GOOGLE_CLIENT_ID`
- Load GIS at `https://accounts.google.com/gsi/client`
- Upon successful initialise the client `window.google?.accounts.oauth2.initCodeClient`
- Upon successful response, make a request to backend at `POST auth/callback` use the provided auth code `res.code` to exchange for refresh token (in the body) and refresh token (set via cookie)

#### Sync flow
- Sync flow is triggered either by changes, staleness, or user's explicit action
- Perform necessary guard check (internet connection, already sync)
- Try using cached access token, else refresh via backend endpoint `POST auth/refresh`
    - If fails, abort and display error
- Try using cached folder id for `ai-jot`, else query for this folder id
    - During the process, if Google responds with `401`, nullify auth status and prompt user to re-connect.
- Query related files
- Download remote data and resolve against local data, using `lastSyncTime`, GDrive's metadata `modifiedTime`, and records' `updatedAt`
- Skip upload if remote data is newer
- Invalidate TanStack query caches to triggers full refetch and re-render

#### Disconnect/logout
- User no longer wants to connect, clicks on `Disconnect` button in settings
- POST request is made to `/auth/logout`
- Server destroys the cookie
- Client nullifies auth status

### Storage structure:
- All JSON files are pretty printed for human readability purpose.

- /ai-jot
    - `items.json`
    - `collections.json`
    - `settings.json` (only data in `profileSettings`; `localSettings` is not synced)

### Resolution logic
- Cloud data is downloaded to local device first, then resolved on a last-write-win basis (via `updatedAt`), before being uploaded

## Offline behaviour

- Application functions normally for the most part
- Link metadata fetch fails, should trigger toast message to inform user
- Sync is unavailable

## Data export/import
User can export all data to one single json file. The same data can be re-imported back. All data are pretty printed.

## Onboarding
First time user (see `shouldShowDemoDataBanner`) will receive a banner inviting them to load Demo data for a taste of the application. Demo data is opt-in only (to avoid friction for existing users starting on a new device).

## File structure

- src
    - pages: include `index.tsx` related components exclusively used in that route
        - Landing
        - Jot (handles both /jot and /jot/:slug)
        - Collections
        - Profile
        - Help
        - Privacy
        - Terms
    - components: shared misc UI
    - hooks: custom hooks
        - useCoreCollections
        - useComboboxParser
    - store: Zustand stores
        - localUserSettings
        - localAppData
        - localSyncData
        - profileSettings
        - coreCollectionSettings
    - db: Dexie setup and schema
    - services: API calls and sync
        - auth
        - link fetch
        - Google Drive sync
    - styles
        - global.scss: global styles, loaded once in main.tsx
    - types.ts
    - theme.ts: Mantine theme config
    - utils: pure helpers
        - slug generator
        - date formatter
    - constants: app-wide constants
        - misc.ts
        - coreCollections.ts
        - keyboardShortcuts.ts
    - routes.tsx: React Router config
    - App.tsx
    - main.tsx

## Demo data

### Items
- Link: Mozilla; https://www.mozilla.org/en-US/; tag: organisation web pretty
- Link: xkcd; https://xkcd.com/; tag: fun
- Link: Keyboard code reference; https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values; tag: work programming web
- Link: Small (web) is beautiful; https://fredrocha.net/2025/05/21/small-web-is-beautiful/; tag: small-web essay goodread web
- Text: Hexcode validator func; tag: work web programming
```
export const isValidHexColourCode = (str: string): boolean => {
    const hexColourCodeRegEx = /(^#[A-Fa-f0-9]{6}$)/;
    return hexColourCodeRegEx.test(str);
}
```
- Todo: Submit PR to fix keyboard shortcut (unchecked); tag: `work programming`
- Text: Carian Knight build; tag: er
```
Lvl: 150
Astrologer

VIG 60
MIN 31
END 20
STR 10
DEX 12
INT 80
FAI 7
ARC 9
```
- Todo: Try Quadrilateral Cowboy; untagged
- Todo: Buy bacon; checked; tag: chore
- Todo: Refill toilet supplies; checked; tag: chore
- Todo: Get Carian Slicer; tag: er
- Todo: Get Sword Dance; tag: er

### Collections
- Elden Ring: tag: er
- Chore: tag: chore
- Work: tag: programming web