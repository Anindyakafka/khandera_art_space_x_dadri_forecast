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

const rawCorpus = [
  JSON.stringify(siteContent),
  aboutContent,
  manifestoContent,
  JSON.stringify(artistsContent),
  JSON.stringify(projectsContent),
  JSON.stringify(eventsContent)
].join(' · ');

export const dadriSmokeCorpus = sanitize(rawCorpus);
