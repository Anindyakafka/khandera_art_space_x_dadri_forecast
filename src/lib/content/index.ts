import aboutMarkdown from '../../../content/docs/about.md?raw';
import manifestoMarkdown from '../../../content/docs/manifesto.md?raw';
import artistsData from '../../../content/data/artists.json';
import eventsData from '../../../content/data/events.json';
import projectsData from '../../../content/data/projects.json';
import siteData from '../../../content/data/site.json';
import type { ArtistContent, EventContent, ProjectContent, SiteContent } from './types';

export const siteContent = siteData as SiteContent;
export const artistsContent = artistsData as ArtistContent[];
export const projectsContent = projectsData as ProjectContent[];
export const eventsContent = eventsData as EventContent[];
export const aboutContent = aboutMarkdown;
export const manifestoContent = manifestoMarkdown;

export function getHomeContent() {
  return {
    site: siteContent,
    projects: projectsContent
  };
}

export function getAboutContent() {
  return {
    site: siteContent,
    aboutMarkdown: aboutContent
  };
}

export function getManifestoContent() {
  return {
    site: siteContent,
    manifestoMarkdown: manifestoContent
  };
}

export function getArtistsContent() {
  return {
    site: siteContent,
    artists: artistsContent
  };
}

export function getProjectsContent() {
  return {
    site: siteContent,
    projects: projectsContent
  };
}

export function getEventsContent() {
  return {
    site: siteContent,
    events: eventsContent
  };
}

export function getDadriForecastContent() {
  return {
    site: siteContent,
    manifestoMarkdown: manifestoContent,
    artists: artistsContent
  };
}
