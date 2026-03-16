export type Project = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  year: number;
};

export const projects: Project[] = [
  {
    id: "p-01",
    title: "Phantom Frequency",
    slug: "phantom-frequency",
    excerpt: "A generative sound sculpture that reconfigures urban memory through spectral color and glitch imagery.",
    image: "/art/phantom-frequency.jpg",
    tags: ["sound", "generative", "installation"],
    liveUrl: "https://example.org/phantom-frequency",
    year: 2025,
  },
  {
    id: "p-02",
    title: "Radical Cartography",
    slug: "radical-cartography",
    excerpt: "Tactile map painting collapsing official boundaries into live-action graffiti choreography.",
    image: "/art/radical-cartography.jpg",
    tags: ["street", "politics", "collage"],
    year: 2024,
  },
];

export type Artist = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  instagram?: string;
};

export const artists: Artist[] = [
  {
    id: "a-01",
    name: "Asha X",
    role: "Founder + Director",
    bio: "Dream alchemist, radical typographer and immersive space designer.",
    avatar: "/artists/asha-x.jpg",
    instagram: "https://instagram.com/ashax.art",
  },
  {
    id: "a-02",
    name: "Sahil Rai",
    role: "Generative Media",
    bio: "Firmware punk coding live visuals on low-wattage installations.",
    avatar: "/artists/sahil-rai.jpg",
  },
];

export type Event = {
  id: string;
  title: string;
  date: string; // ISO date
  location: string;
  summary: string;
  slug: string;
  coverImage: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export const events: Event[] = [
  {
    id: "e-01",
    title: "Street Radar: Night Canvas",
    date: "2026-05-17",
    location: "Dadri Underground Factory",
    summary: "An immersive mapping session for experimental street painting and narrative projection.",
    slug: "street-radar-night-canvas",
    coverImage: "/events/street-radar.jpg",
    ctaLabel: "RSVP",
    ctaUrl: "https://example.org/events/street-radar",
  },
  {
    id: "e-02",
    title: "Signal Break / Code Ritual",
    date: "2026-07-01",
    location: "Pop-up site, Sector 22",
    summary: "A day of performative sound sculptures and media assassins hacking premade narratives.",
    slug: "signal-break-code-ritual",
    coverImage: "/events/signal-break.jpg",
  },
];
