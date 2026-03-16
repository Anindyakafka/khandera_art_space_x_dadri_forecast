export const sanitySchemas = {
  artist: {
    name: 'artist',
    title: 'Artist',
    type: 'document',
    fields: [
      { name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() },
      { name: 'role', title: 'Role', type: 'string' },
      { name: 'bio', title: 'Bio', type: 'text' },
      { name: 'avatar', title: 'Avatar', type: 'image' },
      { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
      { name: 'instagram', title: 'Instagram', type: 'url' }
    ]
  },

  project: {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
      { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
      { name: 'excerpt', title: 'Excerpt', type: 'text' },
      { name: 'body', title: 'Body', type: 'blockContent' },
      { name: 'coverImage', title: 'Cover Image', type: 'image' },
      { name: 'year', title: 'Year', type: 'number' },
      { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
      { name: 'liveUrl', title: 'Live URL', type: 'url' },
      { name: 'status', title: 'Status', type: 'string', options: { list: ['draft', 'published', 'archived'] } }
    ]
  },

  event: {
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
      { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
      { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
      { name: 'date', title: 'Date', type: 'datetime' },
      { name: 'location', title: 'Location', type: 'string' },
      { name: 'summary', title: 'Summary', type: 'text' },
      { name: 'coverImage', title: 'Cover Image', type: 'image' },
      { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
      { name: 'ctaUrl', title: 'CTA URL', type: 'url' }
    ]
  }
};
