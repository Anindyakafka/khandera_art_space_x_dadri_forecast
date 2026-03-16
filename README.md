# Khandera Art Space x Dadri Forecast

## Development setup

1. Install dependencies:
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Open `http://localhost:5173`
4. Build:
   - `npm run build`

## What’s implemented

- SvelteKit scaffold with TypeScript and ESLint/Prettier configuration
- Home page with interactive `Hero` component and project cards
- About page
- Theme variables in `src/app.css`
- Static local dataset in `src/lib/data/content.ts`
- Layout and metadata modules for page head integration

## Next steps

- Add CMS integration adapter (`src/lib/data/cms.ts`)
- Add events and artists routes
- Add a procedural canvas art component (`src/lib/components/AudioReactiveCanvas.svelte`)
- Improve accessibility and keyboard navigation

## CMS integration

The app supports two content sources:

- local fallback (default) using `src/lib/data/content.ts`
- Sanity headless CMS via `src/lib/data/cms.ts` adapter

To enable Sanity:

1. Create `.env`:
   - `VITE_CMS_PROVIDER=sanity`
   - `VITE_SANITY_PROJECT_ID=<your-project-id>`
   - `VITE_SANITY_DATASET=production`
   - `VITE_SANITY_TOKEN=<read-only-token>`
2. Start dev server (`npm run dev`).

### Sanity content model (schema in `src/lib/data/sanitySchema.ts`)

- Artist: name, role, bio, avatar, slug, instagram
- Project: title, slug, excerpt, body, coverImage, year, tags, liveUrl, status
- Event: title, slug, date, location, summary, coverImage, ctaLabel, ctaUrl

## Available routes

- `/` landing
- `/about`
- `/artists`
- `/projects`
- `/events`

Our closest website and radical art research collective
