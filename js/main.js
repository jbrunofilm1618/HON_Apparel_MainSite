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
    scrollObserver.observe(el);
  });


  // ──────────────────────────────────────────────
  // 2. Hero Animation (Staggered on Page Load)
  // ──────────────────────────────────────────────
  const heroElements = document.querySelectorAll('.hero-animate');

  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 * (index + 1)); // 0.3s, 0.6s, 0.9s ...
  });


  // ──────────────────────────────────────────────
  // 3. Navigation — Scroll Background + Scroll Spy
  // ──────────────────────────────────────────────
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('a[data-section]');

  // 3a. Add .scrolled class to nav when user scrolls past 80px
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
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
      // Root margin pulls the detection zone toward the top of the viewport
      // so the "active" link updates as the section enters the upper portion.
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
      if (targetId === '#') return; // ignore bare "#" links

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
  const navToggle = document.querySelector('.nav-toggle');

  if (nav && navToggle) {
    // Open / close on hamburger click
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('menu-open');
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('menu-open');
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

  /**
   * Expand a FAQ item with a smooth height transition.
   * Expects `.faq-item` to contain a `.faq-answer` child.
   */
  function expandAnswer(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    item.classList.add('open');

    // Animate from 0 to auto height
    answer.style.height = '0px';
    answer.style.overflow = 'hidden';

    // Force reflow so the browser registers the starting height
    void answer.offsetHeight;

    answer.style.height = answer.scrollHeight + 'px';

    // After the transition ends, let the height be auto so content
    // reflows naturally if the viewport resizes.
    const onEnd = () => {
      answer.style.height = 'auto';
      answer.style.overflow = '';
      answer.removeEventListener('transitionend', onEnd);
    };
    answer.addEventListener('transitionend', onEnd);
  }

  /**
   * Collapse a FAQ item with a smooth height transition.
   */
  function collapseAnswer(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    // Lock the current computed height so we can transition from it
    answer.style.height = answer.scrollHeight + 'px';
    answer.style.overflow = 'hidden';

    // Force reflow
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

      // Provide visual feedback
      if (submitBtn.tagName === 'INPUT') {
        submitBtn.value = 'Thanks!';
      } else {
        submitBtn.textContent = 'Thanks!';
      }

      submitBtn.disabled = true;

      // Reset after 2.5 seconds
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
