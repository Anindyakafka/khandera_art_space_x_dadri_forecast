# Khandera Art Space x Dadri Forecast

## Development setup

1. Install dependencies:
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Build production output:
   - `npm run build`

## Content-driven workflow

Website content is now controlled from the `content/` and `static/media/` folders.

### Content files

- `content/data/site.json` - global site copy (hero text, manifesto snippet, labels)
- `content/data/projects.json` - project cards and project metadata
- `content/data/artists.json` - artist cards and profile metadata
- `content/data/events.json` - event listings
- `content/docs/about.md` - about page text
- `content/docs/manifesto.md` - manifesto page text

### Media and documents

- `static/media/images/projects/` - project visuals
- `static/media/images/artists/` - artist images
- `static/media/images/events/` - event visuals
- `static/media/docs/` - downloadable documents
- `static/media/video/` - hosted video files

Paths in JSON should point to `/media/...` URLs.

## Editorial update guide

1. Add/update an image in the correct `static/media/images/*` folder.
2. Edit the matching JSON object in `content/data/*.json`.
3. For long-form text, edit markdown files in `content/docs/`.
4. Run `npm run dev` and verify pages.
5. Commit and deploy.

## Available routes

- `/` landing
- `/about`
- `/manifesto`
- `/artists`
- `/projects`
- `/events`

## Notes

- Placeholder media files are included so routes render out of the box.
- Replace `static/media/docs/manifesto.md` with your public document or update `content/data/site.json` to point to a PDF.
- Dadri Forecast long-form text reflow/orb interaction is currently being refined on Dadri pages only.
