import Link from 'next/link';
import Nav from '@/app/components/Nav';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'Blog — Practical guides for service businesses | Goldman Automation',
  description:
    'Practical guides on business automation, lead capture and booking systems for London trades and clinics. Written by someone who has run the businesses he writes about.',
  alternates: { canonical: 'https://goldmanautomation.co.uk/blog/' },
  robots: { index: true, follow: true },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />

      <header className="hero">
        <div className="wrap">
          <span className="eyebrow reveal">// blog</span>
          <h1 className="reveal">Practical guides for service businesses.</h1>
          <p className="lead reveal">
            No fluff. Written by someone who has run a London construction company, built two live
            automation systems, and knows what actually moves the needle in a small service business.
          </p>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="post-card reveal">
                <span className="post-cat">{post.category}</span>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="post-desc">{post.description}</p>
                <div className="post-meta">
                  <span>
                    {new Date(post.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="read-link">
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

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
              <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit">
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
    </>
  );
}
