/* ====================================================
   ENRICH LABS — MAIN JAVASCRIPT
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ─── DROPDOWN MENUS ─── */
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.dropdown-trigger');
    const close = () => {
      item.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    };
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        // Close all others
        dropdownItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherTrigger = other.querySelector('.dropdown-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    }
    // Keyboard accessibility
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    dropdownItems.forEach(item => {
      item.classList.remove('open');
      const trigger = item.querySelector('.dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ─── MOBILE HAMBURGER ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  /* ─── CAPABILITY TABS ─── */
  const capTabs  = document.querySelectorAll('.cap-tab');
  const capPanels = document.querySelectorAll('.cap-panel');
  if (capTabs.length) {
    capTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        // Update tabs
        capTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        // Update panels
        capPanels.forEach(panel => {
          panel.classList.remove('active');
        });
        const targetPanel = document.querySelector(`.cap-panel[data-panel="${target}"]`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  /* ─── PREMIUM FAQ ACCORDION ─── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const faqButtons = document.querySelectorAll('.faq-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSection = document.querySelector('.premium-faq');
  
  let idleTimer = null;
  let idleIndex = 0;
  let isUserInteracting = false;
  
  const openFaq = (btn) => {
    if (prefersReducedMotion) {
      btn.setAttribute('aria-expanded', 'true');
      btn.closest('.faq-item').querySelector('.faq-body').classList.add('open');
      btn.classList.add('open');
      return;
    }
    
    const wasOpen = btn.classList.contains('open');
    
    // Close all
    faqButtons.forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.classList.remove('open');
      b.closest('.faq-item').querySelector('.faq-body')?.classList.remove('open');
    });
    
    // Open clicked if it was closed
    if (!wasOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('open');
      const body = btn.closest('.faq-item').querySelector('.faq-body');
      if (body) body.classList.add('open');
      
      // Smooth scroll to opened item
      setTimeout(() => {
        btn.closest('.faq-item').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };
  
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      isUserInteracting = true;
      clearIdleCycle();
      openFaq(btn);
      setTimeout(() => { isUserInteracting = false; }, 2000);
    });
    
    // Hover glow effect
    if (!prefersReducedMotion) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const glow = btn.querySelector('.faq-glow');
        if (glow && !btn.classList.contains('open')) {
          glow.style.width = '0';
          glow.style.left = x + 'px';
          glow.style.right = 'auto';
          setTimeout(() => { glow.style.left = '0'; glow.style.width = '100%'; }, 10);
        }
      });
    }
  });
  
  // Idle auto-cycle
  const startIdleCycle = () => {
    if (idleTimer || faqItems.length === 0) return;
    idleIndex = 0;
    
    const cycle = () => {
      if (isUserInteracting) {
        idleTimer = setTimeout(cycle, 1000);
        return;
      }
      
      faqItems.forEach(item => item.classList.remove('idle-active'));
      const btn = faqItems[idleIndex].querySelector('.faq-btn');
      openFaq(btn);
      faqItems[idleIndex].classList.add('idle-active');
      
      idleIndex = (idleIndex + 1) % faqItems.length;
      idleTimer = setTimeout(cycle, 5000);
    };
    
    cycle();
  };
  
  const clearIdleCycle = () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    faqItems.forEach(item => item.classList.remove('idle-active'));
  };
  
  // Start idle mode after 15 seconds of no interaction
  if (faqSection && !prefersReducedMotion) {
    let interactionTimer;
    const resetIdleTimer = () => {
      clearTimeout(interactionTimer);
      clearIdleCycle();
      interactionTimer = setTimeout(startIdleCycle, 15000);
    };
    
    ['mousemove', 'mouseenter', 'touchstart', 'scroll'].forEach(evt => {
      faqSection.addEventListener(evt, resetIdleTimer, { passive: true });
    });
    
    resetIdleTimer();
  }
  
  // Intersection observer for entrance animations
  if (faqSection && !prefersReducedMotion) {
    const faqObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.faq-label, .faq-title, .faq-item').forEach(el => {
      el.style.animationPlayState = 'paused';
      faqObserver.observe(el);
    });
  }

  /* ─── SCROLL REVEAL (Intersection Observer) ─── */
  const revealEls = document.querySelectorAll(
    '.section-heading, .section-subheading, .section-tag, ' +
    '.agent-card, .solution-card, .testimonial-card, ' +
    '.workflow-step, .brand-point, .int-card, ' +
    '.cap-panel-text, .cap-panel-visual, .analytics-text, .analytics-visual, ' +
    '.brand-text, .brand-visual, .pricing-preview-card, .faq-item'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of grids
        entry.target.style.transitionDelay = `${(i % 6) * 80}ms`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    el.classList.add('reveal');
    revealObs.observe(el);
  });

  /* ─── TYPING TEXT ANIMATION IN HERO MOCK ─── */
  const typingEls = document.querySelectorAll('.typing-text');
  typingEls.forEach(el => {
    const texts = JSON.parse(el.dataset.texts || '[]');
    if (!texts.length) return;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % texts.length;
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = texts[idx];
        el.style.opacity = '1';
      }, 300);
    }, 2800);
  });

  /* ─── LOGO TICKER PAUSE ON HOVER ─── */
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  /* ─── PRICING TOGGLE ─── */
  const pricingToggleBtn = document.querySelector('.toggle-btn');
  const monthlyPrices = {
    starter: '$39', growth: '$99', enterprise: 'Custom'
  };
  const annualPrices = {
    starter: '$29', growth: '$79', enterprise: 'Custom'
  };
  if (pricingToggleBtn) {
    let isAnnual = false;
    pricingToggleBtn.addEventListener('click', () => {
      isAnnual = !isAnnual;
      pricingToggleBtn.classList.toggle('annual', isAnnual);
      const labels = document.querySelectorAll('.toggle-label');
      labels.forEach((l, i) => l.classList.toggle('active', i === (isAnnual ? 1 : 0)));
      // Update prices if on pricing page
      const prices = isAnnual ? annualPrices : monthlyPrices;
      const planCards = document.querySelectorAll('.plan-card');
      planCards.forEach(card => {
        const id = card.id;
        const priceEl = card.querySelector('.plan-price');
        if (priceEl && id && prices[id]) {
          const suffix = priceEl.querySelector('span');
          priceEl.firstChild.textContent = prices[id];
          if (suffix) priceEl.appendChild(suffix);
        }
      });
    });
  }

  /* ─── SMOOTH ANCHOR SCROLLING ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── ANALYTICS CHANNEL BARS ANIMATION ─── */
  const channelBars = document.querySelectorAll('.channel-fill');
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.width; // re-trigger
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  channelBars.forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 100);
    barObs.observe(bar);
  });

  /* ─── ESCAPE KEY CLOSE MENUS ─── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(item => item.classList.remove('open'));
      if (mobileMenu) mobileMenu.classList.remove('open');
    }
  });

});
