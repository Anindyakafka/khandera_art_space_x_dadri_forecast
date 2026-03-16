import { artists, events, projects } from "$lib/data/content";
import type { Artist, Event, Project } from "$lib/data/content";

const provider = import.meta.env.VITE_CMS_PROVIDER || "local";

// Generic types for CMS model
export type KhanderaArtist = Artist;
export type KhanderaProject = Project;
export type KhanderaEvent = Event;

// adapter interface
export interface KhanderaContentAdapter {
  fetchArtists(): Promise<KhanderaArtist[]>;
  fetchProjects(): Promise<KhanderaProject[]>;
  fetchEvents(): Promise<KhanderaEvent[]>;
  fetchArtistBySlug(slug: string): Promise<KhanderaArtist | undefined>;
  fetchProjectBySlug(slug: string): Promise<KhanderaProject | undefined>;
  fetchEventBySlug(slug: string): Promise<KhanderaEvent | undefined>;
}

function localAdapter(): KhanderaContentAdapter {
  return {
    async fetchArtists() {
      return artists;
    },
    async fetchProjects() {
      return projects;
    },
    async fetchEvents() {
      return events;
    },
    async fetchArtistBySlug(slug: string) {
      return artists.find((item) => item.id === slug || item.name.toLowerCase().replace(/\s+/g, "-") === slug);
    },
    async fetchProjectBySlug(slug: string) {
      return projects.find((item) => item.slug === slug);
    },
    async fetchEventBySlug(slug: string) {
      return events.find((item) => item.slug === slug);
    }
  };
}

function sanityAdapter(): KhanderaContentAdapter {
  const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const token = import.meta.env.VITE_SANITY_TOKEN;

  const baseUrl = `https://${projectId}.api.sanity.io/v2024-11-07/data/query/${dataset}`;

  const fetchSanity = async <T>(query: string): Promise<T> => {
    const url = `${baseUrl}?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    });
    if (!response.ok) {
      throw new Error(`Sanity fetch failed: ${response.statusText}`);
    }

    const { result } = await response.json();
    return result as T;
  };

  return {
    async fetchArtists() {
      return await fetchSanity<KhanderaArtist[]>(`*[_type == \"artist\"] | order(name asc)`);
    },
    async fetchProjects() {
      return await fetchSanity<KhanderaProject[]>(`*[_type == \"project\"] | order(year desc)`);
    },
    async fetchEvents() {
      return await fetchSanity<KhanderaEvent[]>(`*[_type == \"event\"] | order(date desc)`);
    },
    async fetchArtistBySlug(slug: string) {
      const results = await fetchSanity<KhanderaArtist[]>(`*[_type == \"artist\" && slug.current == \"${slug}\"] | order(name asc)`);
      return results[0];
    },
    async fetchProjectBySlug(slug: string) {
      const results = await fetchSanity<KhanderaProject[]>(`*[_type == \"project\" && slug.current == \"${slug}\"] | order(year desc)`);
      return results[0];
    },
    async fetchEventBySlug(slug: string) {
      const results = await fetchSanity<KhanderaEvent[]>(`*[_type == \"event\" && slug.current == \"${slug}\"] | order(date desc)`);
      return results[0];
    }
  };
}

const adapter = provider === "sanity" ? sanityAdapter() : localAdapter();

export default adapter;
