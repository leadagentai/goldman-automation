import { getAllPosts } from '@/lib/posts';

// Bump per-page when that page gets a substantive rewrite.
const HOME_UPDATED = new Date('2026-09-28');
const CORE_PAGES_UPDATED = new Date('2026-09-01');

export default function sitemap() {
  const posts = getAllPosts();

  return [
    {
      url: 'https://goldmanautomation.co.uk/',
      lastModified: HOME_UPDATED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://goldmanautomation.co.uk/trades/',
      lastModified: CORE_PAGES_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://goldmanautomation.co.uk/clinics/',
      lastModified: CORE_PAGES_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://goldmanautomation.co.uk/privacy/',
      lastModified: HOME_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://goldmanautomation.co.uk/blog/',
      lastModified: new Date(posts[0].date),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `https://goldmanautomation.co.uk/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ];
}
