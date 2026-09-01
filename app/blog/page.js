import Script from 'next/script';
import Link from 'next/link';
import Nav from '@/app/components/Nav';
import ContactSection from '@/app/components/ContactSection';
import SiteFooter from '@/app/components/SiteFooter';
import { getAllPosts } from '@/lib/posts';

const animationScript = `
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e)});
  }
})();
`;

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

      <ContactSection
        heading="Want a real number for your business?"
        intro="A 20-minute audit gives you a figure for what admin is costing you — no pitch, no obligation. Tell me your best days and times."
      />

      <SiteFooter />

      <Script
        id="reveal-animations-blog"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: animationScript }}
      />
    </>
  );
}
