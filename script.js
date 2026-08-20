/* =========================================================================
   SOHAIB YOUNAS — PORTFOLIO SCRIPT
   Vanilla JavaScript only. No frameworks, no jQuery.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     1. PRELOADER
     --------------------------------------------------------------- */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('loaded');
  });
  // Safety net: never let the preloader block the page forever if 'load' is slow/blocked
  setTimeout(function () {
    var preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('loaded');
  }, 2500);

  // Hero headline reveal: fires on DOMContentLoaded, not window.load,
  // so it never waits on every project screenshot to finish downloading.
  var heroReveal = document.querySelector('.hero .text-reveal');
  if (heroReveal) {
    setTimeout(function () { heroReveal.classList.add('in-view'); }, 300);
  }

  /* ---------------------------------------------------------------
     2. SCROLL PROGRESS BAR + STICKY NAV STATE
     --------------------------------------------------------------- */
  var progressBar = document.getElementById('scroll-progress');
  var nav = document.querySelector('.site-nav');

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    if (nav) {
      if (scrollTop > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (scrollTop > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     3. ACTIVE NAV LINK HIGHLIGHTING (scroll spy, no plugin)
     --------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('.site-nav .nav-link[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (link) {
    var id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  function updateActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active-link');
      if (current && link.getAttribute('href') === '#' + current.id) {
        link.classList.add('active-link');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* Close mobile nav after clicking a link */
  var collapseEl = document.getElementById('navbarNav');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (collapseEl && collapseEl.classList.contains('show') && window.bootstrap) {
        var bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl);
        bsCollapse.hide();
      }
    });
  });

  /* ---------------------------------------------------------------
     4. HERO TYPING EFFECT
     --------------------------------------------------------------- */
  var roleEl = document.getElementById('hero-role-text');
  var roles = [
    'Creative Web Designer',
    'SEO Specialist',
    'Digital Marketer',
    'WordPress & Shopify Developer'
  ];
  if (roleEl) {
    var roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
  }

  /* ---------------------------------------------------------------
     5. SCROLL REVEAL VIA INTERSECTION OBSERVER
     --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  try {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }
  } catch (err) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Hard safety net: whatever happens above, nothing stays invisible for more
  // than 1.5s. This guarantees content is always readable even if a browser
  // quirk, slow connection, or unsupported API stops the animation above.
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in-view), .text-reveal:not(.in-view)').forEach(function (el) {
      el.classList.add('in-view');
    });
  }, 3500);

  /* ---------------------------------------------------------------
     11. MAGNETIC BUTTONS + HERO PARALLAX (premium micro-interactions)
     --------------------------------------------------------------- */
  var magneticEls = document.querySelectorAll('.social-btn, .btn-send, .custom-btn, .skill-chip');
  magneticEls.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.35 - 3) + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  var heroEl = document.querySelector('.hero');
  var heroGlow = document.querySelector('.hero-glow');
  if (heroEl && heroGlow && window.matchMedia('(min-width: 992px)').matches) {
    heroEl.addEventListener('mousemove', function (e) {
      var rect = heroEl.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroGlow.style.transform = 'translate(' + (x * 40) + 'px,' + (y * 40) + 'px)';
    });
  }

  /* Timeline: animate connecting line + pulse dots as items scroll into view */
  var timelineSection = document.querySelector('.timeline-row');
  if (timelineSection && 'IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          timelineSection.classList.add('draw-line');
        }
      });
    }, { threshold: 0.15 });
    timelineObserver.observe(timelineSection);
  }


  /* ---------------------------------------------------------------
     6. ANIMATED COUNTERS (Achievements)
     --------------------------------------------------------------- */
  var counters = document.querySelectorAll('.achievement[data-count], .hero-trust-num[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------------------------------------------------------------
     6B. VERTICAL WEBSITE PREVIEW HOVER SCROLL
     Handled entirely in CSS (.image-container / .image-container img
     in style.css) via a fixed-height container, overflow hidden, and
     a transform: translateY() transition on hover. No JS required.
     --------------------------------------------------------------- */

  /* ---------------------------------------------------------------
     7. SEO CASE STUDY LIGHTBOX
     Fully unobtrusive: no onclick="" attributes live in the HTML,
     every click is wired up here via addEventListener instead.
     --------------------------------------------------------------- */
  var seoLightboxOverlay = document.getElementById('seoLightboxOverlay');
  var seoLightboxImg = document.getElementById('seoLightboxImg');
  var seoLightboxClose = document.querySelector('.seo-lightbox-close');

  function openSeoLightbox(src, alt) {
    if (!seoLightboxOverlay || !seoLightboxImg) return;
    seoLightboxImg.src = src;
    seoLightboxImg.alt = alt;
    seoLightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSeoLightbox() {
    if (!seoLightboxOverlay) return;
    seoLightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.seo-case-images img').forEach(function (img) {
    img.addEventListener('click', function () {
      openSeoLightbox(img.src, img.alt);
    });
  });
  if (seoLightboxOverlay) {
    seoLightboxOverlay.addEventListener('click', function (e) {
      if (e.target === seoLightboxOverlay) closeSeoLightbox();
    });
  }
  if (seoLightboxClose) {
    seoLightboxClose.addEventListener('click', closeSeoLightbox);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSeoLightbox();
  });

  /* ---------------------------------------------------------------
     8. TESTIMONIALS MARQUEE (seamless infinite loop)
     --------------------------------------------------------------- */
  var marqueeTrack = document.getElementById('testimonialCarousel');
  if (marqueeTrack) {
    var originalCards = Array.prototype.slice.call(marqueeTrack.children);
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marqueeTrack.appendChild(clone);
    });
  }

  /* ---------------------------------------------------------------
     9. CONTACT FORM -> WHATSAPP HANDOFF
     --------------------------------------------------------------- */
  var WHATSAPP_NUMBER = '923082896824';
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        contactForm.reportValidity();
        return;
      }

      var lines = [
        'New project inquiry from the portfolio site:',
        '',
        'Name: ' + name,
        'Email: ' + email
      ];
      if (phone) lines.push('Phone: ' + phone);
      if (subject) lines.push('Subject: ' + subject);
      lines.push('', 'Message: ' + message);

      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
      window.open(url, '_blank');
    });
  }

  /* ---------------------------------------------------------------
     10. FOOTER YEAR
     --------------------------------------------------------------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     11. MAGNETIC BUTTON HOVER (CTA buttons only, lightweight)
     --------------------------------------------------------------- */
  var magneticEls2 = document.querySelectorAll('.social-btn, .btn-send, .custom-btn');
  magneticEls2.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.12).toFixed(1) + 'px,' + (y * 0.28 - 2).toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });

  /* ---------------------------------------------------------------
     12. ANALYTICS EVENT TRACKING (GA4 key events)
     Tracks the actions that actually matter for business, who
     clicks WhatsApp, downloads the resume, emails directly, or
     opens a project / blog article. Every listener uses gaEvent(),
     which fails silently if gtag isn't available.
     --------------------------------------------------------------- */

  // Safe wrapper around gtag(). Never throws, even if GA4 hasn't loaded yet.
  function gaEvent(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
    } catch (err) {
      // fail silently, never break the page for a tracking issue
    }
  }

  // WhatsApp clicks: hero social button, sticky button, footer icon, all match wa.me links
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gaEvent('whatsapp_click', { link_location: el.className || 'unknown' });
    });
  });

  // Resume / CV download button
  document.querySelectorAll('.btn-cv').forEach(function (el) {
    el.addEventListener('click', function () {
      gaEvent('resume_download');
    });
  });

  // Direct email clicks (mailto links), anywhere on the page
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gaEvent('email_click', { link_location: el.className || 'unknown' });
    });
  });

  // Project links (View Live Site / View Repository) and blog "Read Article" links
  // both use the .work-case-link class, so one event covers both, with the
  // link's own text and destination as parameters to tell them apart in GA4.
  document.querySelectorAll('.work-case-link').forEach(function (el) {
    el.addEventListener('click', function () {
      gaEvent('case_link_click', {
        link_text: (el.textContent || '').trim(),
        link_url: el.getAttribute('href') || ''
      });
    });
  });

  // Project category tabs inside "Explore My Work" (Web Development / WooCommerce / SEO)
  document.querySelectorAll('#projectTabs button[data-bs-toggle="tab"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gaEvent('project_tab_click', { tab_name: (el.textContent || '').trim() });
    });
  });

  // Homepage -> Blog navigation (nav bar and footer "Blog" links point to blog/)
  document.querySelectorAll('a[href="blog/"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gaEvent('blog_visit_click', { link_location: el.closest('footer') ? 'footer' : 'nav' });
    });
  });

});
