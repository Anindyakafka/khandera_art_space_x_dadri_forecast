export type SiteContent = {
  name: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  home: {
    projectsHeading: string;
    projectsIntro: string;
    manifestoHeading: string;
    manifestoExcerpt: string;
    manifestoLinkLabel: string;
  };
  manifestoDocumentPath: string;
};

export type ProjectContent = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  year: number;
};

export type ArtistContent = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  instagram?: string;
};

export type EventContent = {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  slug: string;
  coverImage: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type SupportFund = {
  id: string;
  title: string;
  summary: string;
  targetAmount: number | null;
  receivedAmount: number;
  spentAmount: number;
  lastUpdated: string;
  statusNote: string;
};
