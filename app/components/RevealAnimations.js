'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.reveal');

    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((e) => io.observe(e));

    // Counter animation — only runs when .proof section exists (homepage)
    if (!reduce) {
      const proof = document.querySelector('.proof');
      if (proof) {
        let counted = false;
        const po = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !counted) {
                counted = true;
                document.querySelectorAll('[data-count]').forEach((n) => {
                  const target = parseInt(n.getAttribute('data-count'), 10);
                  let start = null;
                  const duration = 1100;
                  function step(ts) {
                    if (!start) start = ts;
                    const p = Math.min((ts - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    n.textContent = Math.round(ease * target);
                    if (p < 1) requestAnimationFrame(step);
                    else n.textContent = target;
                  }
                  requestAnimationFrame(step);
                });
                po.disconnect();
              }
            });
          },
          { threshold: 0.4 }
        );
        po.observe(proof);
      }
    }

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
