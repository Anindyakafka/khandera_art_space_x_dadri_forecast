# Khandera Art Space × Dadri Forecast

## What this website is

This website is a **living archive, public interface, and editorial space** for **Khandera Art Space** and its expanding community of artists, researchers, villagers, collaborators, and militant learners. It is not designed as a neutral portfolio or a polished institutional brochure. It is a site for gathering materials, positions, experiments, and encounters that emerge from the social and political conditions around **Khandera village and the Dadri region of Uttar Pradesh**.

Khandera Art Space was shaped through collective work with villagers and collaborators in Girirajpur, Khandera, Dadri. The space takes inspiration from Dr. B. R. Ambedkar’s call to **educate, agitate, organise, stay confident, and never give up**, and understands art not as decoration but as a way to build discourse, solidarity, and forms of resistance.

---

## Why Dadri Forecast is the ethical center

While this website carries the wider identity of **Khandera Art Space**, its political and ethical pulse is **Dadri Forecast**.

Dadri Forecast is a collective research and cultural initiative focused on the transformations of Dadri under extractive development, ecological destruction, caste and communal violence, and the dispossession of working people. The project refuses both the glossy myth of “development” and the nostalgia of a frozen past. Instead, it asks what kinds of futures are being imposed on the region, who is asked to pay for them, and how a counter-space for thought, art, and struggle can be built from below.

In that sense, this website stands for:

- **militant research rooted in community**
- **counter-knowledge against extractive and exclusionary development**
- **solidarity with villagers, children, workers, artists, and students**
- **care for land, wetlands, memory, and local histories**
- **a refusal of communalism, dispossession, and the NGO-isation of resistance**

This is why, whenever the site speaks in its strongest voice about purpose, motto, and ethics, **Dadri Forecast remains the focus**.

---

## What lives on the site

The website brings together multiple kinds of material:

- **about texts** that situate Khandera Art Space in its local and collective history
- **manifesto writing** that frames Dadri Forecast as a long-term political and cultural practice
- **artist pages** for collaborators and collective participants
- **project dossiers** that document workshops, open studios, and research-based work
- **events and public material** that trace the evolving life of the initiative

Across these sections, the site tries to function as both an **archive** and an **active interface** — a place where documentation, atmosphere, memory, and experiment can coexist.

---

## How the website is built and maintained

This is a **SvelteKit** site with a content-driven structure. Most editorial updates happen through data and markdown files rather than hard-coded copy.

### Main content sources

- `content/data/site.json` — site-wide text, labels, and landing-page copy
- `content/data/projects.json` — project cards and metadata
- `content/data/artists.json` — artist and collaborator data
- `content/data/events.json` — event listings
- `content/docs/about.md` — long-form About text
- `content/docs/manifesto.md` — long-form Dadri Forecast manifesto text

### Media locations

- `static/media/images/projects/`
- `static/media/images/artists/`
- `static/media/images/events/`
- `static/media/docs/`
- `static/media/video/`

When linking media in JSON, use `/media/...` paths.

---

## Working with the project

If you need to run or update the site locally:

```bash
npm install
npm run dev
npm run build
```

Typical editorial workflow:

1. add or replace media in `static/media/`
2. update the matching records in `content/data/*.json`
3. edit long-form texts in `content/docs/*.md`
4. preview changes locally and verify the affected pages

---

## Current direction

The site is continuing to evolve as an experimental editorial environment. In particular, the **Dadri Forecast pages** are being treated as the most active zone for interaction, atmosphere, and long-form reading experiments.

This repository therefore documents not just a website, but an ongoing attempt to build a digital space for **collective memory, political imagination, and insurgent cultural work**.
