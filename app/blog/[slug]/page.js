import { notFound } from 'next/navigation';
import Script from 'next/script';
import Nav from '@/app/components/Nav';
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

  const ctaSubject = encodeURIComponent('Free automation audit');

  return (
    <>
      <Nav />

      <div className="article-wrap">
        <div className="article-header">
          <a href="/blog" className="back-link">
            ← All posts
          </a>
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

        <div className="article-cta">
          <p>
            <strong>Want to know what automation would cost for your business?</strong> A
            20-minute audit will give you a real number — no pitch, no obligation.
          </p>
          <a
            href={`mailto:hello@goldmanautomation.co.uk?subject=${ctaSubject}`}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Book a free audit →
          </a>
        </div>
      </div>

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <a href="/" className="logo">
              Goldman<span>.</span>
            </a>
            <p>
              Automation studio · London, UK
              <br />
              Trades · clinics · custom workflows
            </p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h4>Pages</h4>
              <a href="/">Home</a>
              <a href="/trades">For trades</a>
              <a href="/clinics">For clinics</a>
              <a href="/blog">Blog</a>
            </div>
            <div className="foot-col">
              <h4>Get in touch</h4>
              <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a>
              <a href={`mailto:hello@goldmanautomation.co.uk?subject=${ctaSubject}`}>
                Book a free audit
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="wrap">
            <span>© 2026 Goldman Automation</span>
            <span>Built by a founder, not an agency.</span>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
