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

  /* ═══════════════════════════════════════════
     AI COMMAND CENTER - GRAND FINALE
  ═══════════════════════════════════════════ */
  
  // Activity Feed Events
  const activityEvents = [
    { text: 'Campaign approved by Helena', icon: 'success', agent: 'helena' },
    { text: 'SEO score improved +12 points', icon: 'success', agent: 'sam' },
    { text: 'Email sequence launched', icon: 'info', agent: 'angela' },
    { text: 'Competitor detected in market', icon: 'warning', agent: 'kai' },
    { text: 'Social engagement increased 34%', icon: 'success', agent: 'kai' },
    { text: 'Weekly report delivered', icon: 'info', agent: 'helena' },
    { text: 'Content optimized for ranking', icon: 'success', agent: 'sam' },
    { text: 'New leads qualified: 47', icon: 'success', agent: 'angela' },
    { text: 'Ad budget reallocated', icon: 'info', agent: 'helena' },
    { text: 'Keyword rankings updated', icon: 'info', agent: 'sam' },
    { text: 'Email open rate: 42%', icon: 'success', agent: 'angela' },
    { text: 'Social post scheduled', icon: 'info', agent: 'kai' },
    { text: 'Conversion goal exceeded', icon: 'success', agent: 'helena' },
    { text: 'Backlink discovered', icon: 'success', agent: 'sam' },
    { text: 'Campaign paused for review', icon: 'warning', agent: 'helena' },
  ];
  
  let feedIndex = 0;
  const feedList = document.getElementById('ai-feed-list');
  
  const addFeedItem = () => {
    if (!feedList) return;
    
    const event = activityEvents[feedIndex % activityEvents.length];
    const item = document.createElement('div');
    item.className = 'ai-feed-item';
    item.innerHTML = `
      <div class="feed-icon ${event.icon}">
        ${event.icon === 'success' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' : ''}
        ${event.icon === 'info' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' : ''}
        ${event.icon === 'warning' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' : ''}
      </div>
      <span class="feed-text">${event.text}</span>
      <span class="feed-time">${Math.floor(Math.random() * 30) + 1}s ago</span>
    `;
    
    feedList.insertBefore(item, feedList.firstChild);
    
    // Fade out old items
    const items = feedList.querySelectorAll('.ai-feed-item');
    if (items.length > 5) {
      items[items.length - 1].classList.add('fade-out');
      setTimeout(() => items[items.length - 1].remove(), 400);
    }
    
    feedIndex++;
  };
  
  // Initialize feed with some items
  if (feedList) {
    for (let i = 0; i < 3; i++) {
      addFeedItem();
    }
    // Add new items periodically
    setInterval(addFeedItem, 4000);
  }
  
  // Timeline Animation
  const timelineNodes = document.querySelectorAll('.ai-node');
  const timelineProgress = document.getElementById('ai-timeline-progress');
  const aiSection = document.querySelector('.ai-command-center');
  
  const animateTimeline = () => {
    if (!timelineNodes.length || !timelineProgress) return;
    
    let currentStep = 0;
    const totalSteps = timelineNodes.length;
    const progressPerStep = 100 / (totalSteps - 1);
    
    const interval = setInterval(() => {
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        // Reset after delay
        setTimeout(() => {
          timelineNodes.forEach(n => n.classList.remove('active', 'completed'));
          timelineProgress.style.width = '0%';
          animateTimeline();
        }, 3000);
        return;
      }
      
      if (currentStep > 0) {
        timelineNodes[currentStep - 1].classList.remove('active');
        timelineNodes[currentStep - 1].classList.add('completed');
      }
      
      timelineNodes[currentStep].classList.add('active');
      timelineNodes[currentStep].classList.add('visible');
      timelineProgress.style.width = (currentStep * progressPerStep) + '%';
      
      currentStep++;
    }, 400);
  };
  
  // Intersection Observer for timeline
  const timelineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate nodes appearing
        timelineNodes.forEach((node, i) => {
          setTimeout(() => node.classList.add('visible'), i * 100);
        });
        // Start timeline animation after nodes appear
        setTimeout(animateTimeline, timelineNodes.length * 100 + 500);
        timelineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  if (aiSection) timelineObs.observe(aiSection);
  
  // Chart Animation
  const chartContainer = document.getElementById('ai-chart');
  if (chartContainer) {
    const createBars = () => {
      chartContainer.innerHTML = '';
      for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'ai-chart-bar';
        bar.style.height = '0%';
        chartContainer.appendChild(bar);
      }
    };
    createBars();
    
    const animateChart = () => {
      const bars = chartContainer.querySelectorAll('.ai-chart-bar');
      bars.forEach((bar, i) => {
        setTimeout(() => {
          const height = Math.random() * 80 + 20;
          bar.style.height = height + '%';
        }, i * 50);
      });
    };
    
    const chartObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateChart();
          setInterval(animateChart, 5000);
          chartObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    chartObs.observe(chartContainer);
  }
  
  // CTA Progress Animation
  const ctaProgress = document.getElementById('ai-cta-progress');
  if (ctaProgress) {
    setTimeout(() => {
      ctaProgress.style.width = '100%';
    }, 2000);
  }
  
  // Metrics Update Animation
  const updateMetrics = () => {
    const metrics = ['roi', 'traffic', 'conversions'];
    metrics.forEach(metric => {
      const el = document.getElementById('metric-' + metric);
      if (el) {
        const change = Math.floor(Math.random() * 10) - 3;
        const current = parseInt(el.textContent.replace(/[^0-9]/g, ''));
        const sign = el.textContent.includes('+') ? '+' : '';
        el.textContent = sign + (current + change) + '%';
      }
    });
  };
  
  setInterval(updateMetrics, 8000);
  
  // Magnetic Button Effect
  document.querySelectorAll('.btn-cta-white').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-3px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

});
