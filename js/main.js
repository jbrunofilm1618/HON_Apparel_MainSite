/**
 * HON Athletic Apparel - Main Site JavaScript
 * Vanilla JS only. No frameworks.
 *
 * Handles:
 *  1. Scroll animations (Intersection Observer)
 *  2. Hero staggered animation on page load
 *  3. Navigation scroll spy + background transition
 *  4. Smooth scroll for anchor links
 *  5. Mobile menu toggle
 *  6. FAQ accordion
 *  7. Email capture form placeholder
 */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────
  // 1. Scroll Animations via Intersection Observer
  // ──────────────────────────────────────────────
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up, .fade-in, .scale-in').forEach(el => {
    // Skip hero elements — they animate on page load, not scroll
    if (el.closest('.hero-content')) return;
    scrollObserver.observe(el);
  });


  // ──────────────────────────────────────────────
  // 2. Hero Animation (Staggered on Page Load)
  // ──────────────────────────────────────────────
  // Add .visible to all hero fade-ups at once after a brief delay.
  // CSS transition-delay on each child handles the stagger timing.
  const heroFadeEls = document.querySelectorAll('.hero-content .fade-up');

  if (heroFadeEls.length > 0) {
    setTimeout(() => {
      heroFadeEls.forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  }


  // ──────────────────────────────────────────────
  // 3. Navigation — Scroll Background + Scroll Spy
  // ──────────────────────────────────────────────
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const isHomepage = document.getElementById('hero') !== null;

  // 3a. Transparent → solid nav on scroll (homepage only)
  if (siteNav && isHomepage) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3b. Scroll spy — highlight the nav link whose section is in view
  const spySections = document.querySelectorAll('#hero, #name, #collection, #journal, #subscribe');

  if (spySections.length > 0 && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          navLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    spySections.forEach(section => {
      spyObserver.observe(section);
    });
  }


  // ──────────────────────────────────────────────
  // 4. Smooth Scroll for Anchor Links
  // ──────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ──────────────────────────────────────────────
  // 5. Mobile Menu Toggle
  // ──────────────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close menu when a mobile link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }


  // ──────────────────────────────────────────────
  // 6. FAQ Accordion
  // ──────────────────────────────────────────────
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');
      if (!parentItem) return;

      const isAlreadyOpen = parentItem.classList.contains('open');

      // Close every other open FAQ item first (one-at-a-time behavior)
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== parentItem) {
          collapseAnswer(openItem);
        }
      });

      // Toggle the clicked item
      if (isAlreadyOpen) {
        collapseAnswer(parentItem);
      } else {
        expandAnswer(parentItem);
      }
    });
  });

  function expandAnswer(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    item.classList.add('open');

    answer.style.height = '0px';
    answer.style.overflow = 'hidden';

    void answer.offsetHeight;

    answer.style.height = answer.scrollHeight + 'px';

    const onEnd = () => {
      answer.style.height = 'auto';
      answer.style.overflow = '';
      answer.removeEventListener('transitionend', onEnd);
    };
    answer.addEventListener('transitionend', onEnd);
  }

  function collapseAnswer(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    answer.style.height = answer.scrollHeight + 'px';
    answer.style.overflow = 'hidden';

    void answer.offsetHeight;

    answer.style.height = '0px';

    const onEnd = () => {
      item.classList.remove('open');
      answer.style.height = '';
      answer.style.overflow = '';
      answer.removeEventListener('transitionend', onEnd);
    };
    answer.addEventListener('transitionend', onEnd);
  }


  // ──────────────────────────────────────────────
  // 7. Email Capture Form Placeholder
  // ──────────────────────────────────────────────
  const emailForms = document.querySelectorAll('.email-capture');

  emailForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent || submitBtn.value;

      if (submitBtn.tagName === 'INPUT') {
        submitBtn.value = 'Thanks!';
      } else {
        submitBtn.textContent = 'Thanks!';
      }

      submitBtn.disabled = true;

      setTimeout(() => {
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = originalText;
        } else {
          submitBtn.textContent = originalText;
        }
        submitBtn.disabled = false;
        form.reset();
      }, 2500);
    });
  });

});
