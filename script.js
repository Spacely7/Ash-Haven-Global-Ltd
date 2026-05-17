/* ════════════════════════════════════════════
   ASH HAVEN GLOBAL LTD — script.js
   ════════════════════════════════════════════ */

'use strict';

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 2000);
});


/* ── CUSTOM CURSOR ── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth ring lag
  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover state on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .service-card, .why-card, .sector-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '0.5';
  });
}


/* ── NAVBAR — scroll behaviour ── */
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load


/* ── NAVBAR — active link on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activateLink = () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};
window.addEventListener('scroll', activateLink, { passive: true });


/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ── HERO PARTICLES ── */
const particlesContainer = document.getElementById('particles');

const createParticles = () => {
  if (!particlesContainer) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size  = Math.random() * 4 + 1.5;
    const left  = Math.random() * 100;
    const delay = Math.random() * 12;
    const dur   = Math.random() * 10 + 12;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;
    particlesContainer.appendChild(p);
  }
};
createParticles();


/* ── ANIMATED COUNTERS ── */
const counters = document.querySelectorAll('.stat-num[data-count]');

const animateCounter = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
};

// Trigger counters when hero is in view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroEl = document.getElementById('hero');
if (heroEl) counterObserver.observe(heroEl);


/* ── SCROLL REVEAL (AOS-style) ── */
const aosElements = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.aosDelay || 0, 10);
      setTimeout(() => el.classList.add('aos-animate'), delay);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

aosElements.forEach(el => aosObserver.observe(el));


/* ── BACK TO TOP ── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── FORM VALIDATION & SUBMISSION ── */
const validate = (id, errId, msg, condition) => {
  const el    = document.getElementById(id);
  const errEl = document.getElementById(errId);
  if (!el || !errEl) return true;
  if (condition(el.value)) {
    el.classList.add('error');
    errEl.textContent = msg;
    errEl.classList.add('show');
    return false;
  }
  el.classList.remove('error');
  errEl.classList.remove('show');
  return true;
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  let valid = true;

  valid &= validate('fname',   'fnameErr',   'First name is required.',              v => !v.trim());
  valid &= validate('lname',   'lnameErr',   'Last name is required.',               v => !v.trim());
  valid &= validate('email',   'emailErr',   'A valid email address is required.',   v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()));
  valid &= validate('service', 'serviceErr', 'Please select a service.',             v => !v);

  if (!valid) return;

  // Simulate async submission
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');
  const arrow   = document.getElementById('btnArrow');

  btn.disabled = true;
  btnText.textContent = 'Sending…';
  spinner.classList.remove('hidden');
  if (arrow) arrow.classList.add('hidden');

  setTimeout(() => {
    document.getElementById('quoteForm').classList.add('hidden');
    document.getElementById('formSuccess').classList.remove('hidden');
  }, 2000);
};

// Expose to HTML onclick
window.handleFormSubmit = handleFormSubmit;


/* ── TICKER PAUSE ON HOVER ── */
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}


/* ── SERVICE CARD TILT EFFECT ── */
const tiltCards = document.querySelectorAll('.service-card, .sector-card, .why-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotX   = ((y - cy) / cy) * -5;
    const rotY   = ((x - cx) / cx) *  5;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});


/* ── INPUT FLOATING LABEL EFFECT ── */
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
});


/* ── NAVBAR HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ── */
let lastScrollY = 0;
let ticking     = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 200) {
        // Scrolling down — keep nav scrolled state
        navbar.style.transform = 'translateY(0)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScrollY = currentY;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });


/* ── LOGO SVG ORBIT ANIMATION (hero) ── */
// Add subtle rotation to the globe lines in the SVG via JS
const globeLines = document.querySelectorAll('.globe-eq, .globe-me');
let angle = 0;

const rotateGlobe = () => {
  angle += 0.2;
  // subtle effect using CSS transform on parent if needed
  requestAnimationFrame(rotateGlobe);
};


/* ── FOOTER YEAR ── */
const yearEl = document.querySelector('.footer-bottom-inner p');
if (yearEl) {
  yearEl.textContent = `© ${new Date().getFullYear()} Ash Haven Global Ltd. All rights reserved.`;
}


/* ── INTERSECTION: NAV PILL HIGHLIGHT based on section colour ── */
const darkSections = document.querySelectorAll('.section-dark');
const navbarEl     = document.getElementById('navbar');

const sectionColorObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Already handled by .scrolled class
  });
}, { threshold: 0.5 });

darkSections.forEach(sec => sectionColorObs.observe(sec));


/* ── INIT COMPLETE LOG ── */
console.log('%c🌍 Ash Haven Global Ltd — Website Loaded Successfully', 'color:#f07c1e;font-size:14px;font-weight:700;');
