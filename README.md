# WOW PAPERS (Web)

A premium neon wallpaper browser that reads dynamically from a Google Drive wallpaper collection via a Google Apps Script JSON feed. Pure static React (Vite) frontend — no backend server required. Deployable to Netlify (or any static host).

## How it works

- Your Google Apps Script `/exec` endpoint returns JSON in the shape:
  `{ updated, folders: [{ name, files: [...] }] }`.
- The app normalizes this (and an older `sections`/`categories` shape, for backward compatibility) in `src/lib/normalizeFeed.js`, filters to supported image types (jpg/jpeg/png/webp/gif), and sorts each folder's files newest-first.
- The feed is fetched **directly from the browser** (`src/api.js`) — the Apps Script feed already sends `Access-Control-Allow-Origin: *`, so no proxy/backend is needed.
- The app keeps a local (`localStorage`) copy of the last successful feed so it boots instantly on repeat visits (stale-while-revalidate), then refreshes silently in the background.
- Folders are entirely data-driven: add, rename, or remove a folder in Drive, and it appears/updates/disappears here on the next refresh — nothing is hard-coded.
- Wallpaper images are displayed via Google's `drive.google.com/thumbnail` embed endpoint rather than the feed's raw `uc?export=view` link, because Drive's `uc?export=view` sets `Cross-Origin-Resource-Policy: same-site`, which modern browsers block when used as a cross-site `<img>` source (it only works via direct top-level navigation). Downloads still use the original `uc?export=download` link. See `src/utils/driveImage.js`.
- Favorites are stored on-device only, in the browser's `localStorage` — no server database.

## Running locally

```bash
npm install
cp .env.example .env   # set VITE_WOWPAPERS_FEED_URL to your Apps Script /exec URL
python scripts/generate-icons.py   # requires: pip install Pillow — generates public/icons/*.png
npm run dev             # http://localhost:5173
```

## Building for production

```bash
npm run build           # outputs to dist/
npm run preview         # serve the production build locally
```

## Deploying to Netlify

**Option A — drag and drop:**
1. `npm run build`
2. Drag the `dist` folder onto https://app.netlify.com/drop

**Option B — git-connected (auto-deploys on push):**
1. Import this repo in Netlify ("Add new site → Import from Git")
2. Build command: `npm run build` · Publish directory: `dist` (already configured via `netlify.toml`)
3. In Site settings → Environment variables, add `VITE_WOWPAPERS_FEED_URL` = your Apps Script `/exec` URL
4. Deploy

`netlify.toml` includes a SPA redirect (`/* -> /index.html`) so client-side routes (`/browse`, `/favorites`, `/settings`) work on direct load/refresh.

## Environment variables

| Variable                     | Description                                                    |
| ---------------------------- | ---------------------------------------------------------------- |
| `VITE_WOWPAPERS_FEED_URL`    | Your Google Apps Script `/exec` deployment URL (baked in at build time) |

## Notes

- PWA icons (`public/icons/*.png`) are **not** committed as binary files to this repo (some commit paths can corrupt binary content). Instead, run `python scripts/generate-icons.py` once after cloning (requires `pip install Pillow`) to generate a neon "W" icon set at 192x192, 512x512 (+ maskable), and 180x180 (apple-touch-icon) into `public/icons/`.
- Installable as a PWA: on iOS, open the deployed site in Safari → Share → Add to Home Screen.
