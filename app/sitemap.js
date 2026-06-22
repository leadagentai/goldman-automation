import { getAllPosts } from '@/lib/posts';

export default function sitemap() {
  const posts = getAllPosts();

  return [
    {
      url: 'https://goldmanautomation.co.uk/',
      lastModified: new Date('2026-06-22'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://goldmanautomation.co.uk/trades/',
      lastModified: new Date('2026-06-22'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://goldmanautomation.co.uk/clinics/',
      lastModified: new Date('2026-06-22'),
      changeFrequency: 'monthly',
      priority: 0.8,
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
