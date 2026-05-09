/* ══════════════════════════════════════
   DENYTECH — script.js
   All interactivity: menu, modals,
   scroll animations, counter, parallax
══════════════════════════════════════ */

// ── DOM READY ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initAuthModal();
  initScrollReveal();
  initCounters();
  initNavScroll();
  initHeroParallax();
  initSmoothScroll();
  initFormSubmit();
});

// ══════════════════════════════════════
// MENU
// ══════════════════════════════════════
function initMenu() {
  const overlay  = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('menuClose');
  const toggles  = [
    document.getElementById('menuToggle'),
    document.getElementById('menuToggleIcon'),
  ];

  function openMenu() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggles.forEach(el => el && el.addEventListener('click', openMenu));
  closeBtn.addEventListener('click', closeMenu);

  // Close on bg click (outside menu content)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  // Close menu and scroll to section on link click
  overlay.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      // Scroll after transition
      setTimeout(() => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 400);
    });
  });

  // Keyboard: Escape closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeMenu();
  });
}

// ══════════════════════════════════════
// AUTH MODAL
// ══════════════════════════════════════
function initAuthModal() {
  const modal      = document.getElementById('authModal');
  const closeBtn   = document.getElementById('authClose');
  const loginBtn   = document.getElementById('loginBtn');
  const signupBtn  = document.getElementById('btn2');
  const tabs       = modal.querySelectorAll('.auth-tab');
  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const switchSU   = document.getElementById('switchToSignup');
  const switchLI   = document.getElementById('switchToLogin');

  function openModal(tab = 'login') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    loginForm.classList.toggle('hidden', name !== 'login');
    signupForm.classList.toggle('hidden', name !== 'signup');
  }

  loginBtn  && loginBtn.addEventListener('click', () => openModal('login'));
  signupBtn && signupBtn.addEventListener('click', () => openModal('signup'));
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  switchSU && switchSU.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('signup');
  });

  switchLI && switchLI.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('login');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

// ══════════════════════════════════════
// SCROLL REVEAL (Intersection Observer)
// ══════════════════════════════════════
function initScrollReveal() {
  // Add .reveal to elements we want to animate
  const revealSelectors = [
    '.service-card',
    '.stat-item',
    '.about-text-col',
    '.about-img-col',
    '.contact-left',
    '.contact-right',
    '.team-card',
    '.section-tag',
    '.section-title',
    '.about-lead',
  ];

  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 4 === 1) el.classList.add('reveal-delay-1');
      if (i % 4 === 2) el.classList.add('reveal-delay-2');
      if (i % 4 === 3) el.classList.add('reveal-delay-3');
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ══════════════════════════════════════
// ANIMATED COUNTERS
// ══════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const ease = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };

    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => io.observe(c));
}

// ══════════════════════════════════════
// NAV SCROLL SHADOW
// ══════════════════════════════════════
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ══════════════════════════════════════
// HERO CARD PARALLAX (mouse move)
// ══════════════════════════════════════
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  const imgs = [
    { el: document.getElementById('img1'), factor: 0.025 },
    { el: document.getElementById('img2'), factor: 0.018 },
    { el: document.getElementById('img3'), factor: 0.012 },
    { el: document.getElementById('img4'), factor: 0.006 },
  ].filter(i => i.el);

  const baseRotations = [-28, -16, -6, 6];
  const baseOffsets   = [-20, -10, 0, 10];

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let raf;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = (e.clientX - rect.left - rect.width  / 2);
    targetY = (e.clientY - rect.top  - rect.height / 2);
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    imgs.forEach(({ el, factor }, i) => {
      const rot  = baseRotations[i] + currentX * 0.01;
      const tx   = baseOffsets[i]   + currentX * factor;
      const ty   = currentY * factor * 0.6;
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg)`;
    });

    raf = requestAnimationFrame(animate);
  }

  animate();

  // Stop animation when hero not visible (performance)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(animate);
      });
    },
    { threshold: 0 }
  );

  io.observe(hero);
}

// ══════════════════════════════════════
// SMOOTH SCROLL (footer / nav links)
// ══════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ══════════════════════════════════════
// CONTACT FORM SUBMIT (client-side UX)
// ══════════════════════════════════════
function initFormSubmit() {
  const forms = document.querySelectorAll('.contact-form, .auth-form');

  forms.forEach(form => {
    const btn = form.querySelector('.form-submit');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll('input, textarea');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ff4500';
          valid = false;
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) return;

      const original = btn.innerHTML;
      btn.innerHTML = '<i class="ri-check-line"></i> Sent!';
      btn.style.background = '#16a34a';
      btn.style.borderColor = '#16a34a';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        inputs.forEach(i => i.value = '');
      }, 2800);
    });
  });
}

// ══════════════════════════════════════
// CURSOR GLOW (desktop only)
// ══════════════════════════════════════
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,69,0,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.4s;
    z-index: 0;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  (function loop() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
})();
