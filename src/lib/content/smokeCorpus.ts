import {
  aboutContent,
  artistsContent,
  eventsContent,
  manifestoContent,
  projectsContent,
  siteContent
} from './index';

function sanitize(value: string) {
  return value
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\/media\/\S+/gi, ' ')
    .replace(/[{}[\]"'`:_*#<>~=|\\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectStrings(input: unknown): string[] {
  if (typeof input === 'string') {
    return [input];
  }

  if (Array.isArray(input)) {
    return input.flatMap(collectStrings);
  }

  if (input && typeof input === 'object') {
    return Object.values(input).flatMap(collectStrings);
  }

  return [];
}

const narrativeBits = [
  ...collectStrings(siteContent),
  aboutContent,
  manifestoContent,
  ...artistsContent.flatMap((artist) => [artist.name, artist.role, artist.bio]),
  ...projectsContent.flatMap((project) => [project.title, project.excerpt, ...(project.tags ?? [])]),
  ...eventsContent.flatMap((event) => [event.title, event.location, event.summary])
].filter(Boolean);

export const dadriSmokeCorpus = sanitize(narrativeBits.join(' · '));
