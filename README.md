# zehjulianlp.github.io

Personal website project for `https://zehjulianlp.github.io`.

## Features

- Multi-page personal website (Home, About, Projects, Dragon Stuff, Guestbook, Socials, Collection)
- Global site search page at `/search/` with direct deep links to sections/items
- JSON-driven content areas:
  - `projects/projects.json`
  - `socials/socials.json`
  - `collection/items.json`
- Collection gallery with:
  - overcategories + categories
  - item thumbnails
  - fullscreen viewer with close button, next/previous arrows, keyboard navigation, and item details
- Mobile hamburger navbar
- Search shortcut: `Ctrl + K` / `Cmd + K`

## Content Editing

### Add or edit projects

Edit `projects/projects.json`.

### Add or edit socials/friends

Edit `socials/socials.json`.

### Add or edit collection items

Edit `collection/items.json`.

Supported item fields:

- `title`
- `overCategory`
- `category`
- `status`
- `notes`
- `image`
- `imageAlt`
- `link` (optional)

## Search Configuration

Search sources are configured in `search/search-config.js`.

- `htmlPages`: static section indexing via selectors + ids
- `jsonCollections`: JSON source indexing with anchor prefixes
