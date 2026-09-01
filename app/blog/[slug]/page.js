import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/app/components/Nav';
import ContactSection from '@/app/components/ContactSection';
import SiteFooter from '@/app/components/SiteFooter';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: `${post.title} | Goldman Automation`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'en_GB',
      url: `https://goldmanautomation.co.uk/blog/${post.slug}/`,
      images: [{ url: 'https://goldmanautomation.co.uk/og-image.png' }],
      publishedTime: new Date(post.date).toISOString(),
    },
    alternates: {
      canonical: `https://goldmanautomation.co.uk/blog/${post.slug}/`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Adrian Goldman',
      url: 'https://goldmanautomation.co.uk/',
    },
    publisher: {
      '@id': 'https://goldmanautomation.co.uk/#org',
    },
    url: `https://goldmanautomation.co.uk/blog/${post.slug}/`,
    image: 'https://goldmanautomation.co.uk/og-image.png',
  };

  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Nav />

      <div className="article-wrap">
        <div className="article-header">
          <Link href="/blog" className="back-link">
            ← All posts
          </Link>
          <span className="post-cat">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span>{formattedDate}</span>
            <span>{post.readTime}</span>
            <span>Adrian Goldman</span>
          </div>
        </div>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

      </div>

      <ContactSection
        heading="Want a real number for your business?"
        intro="A 20-minute audit gives you a figure for what admin is costing you — no pitch, no obligation. Tell me your best days and times."
      />

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
