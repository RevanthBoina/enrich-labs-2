/* ═══════════════════════════════════════════════════
   SOLUTIONS SECTION — Premium Interactive Logic
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.usecases');
  if (!section) return;

  /* ─── 1. STAGGERED REVEAL (IntersectionObserver) ─── */
  const revealEls = section.querySelectorAll('.sol-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ─── 2. GROWTH WORD LIGHT SWEEP ─── */
  const growthWord = section.querySelector('.sol-growth-word');
  if (growthWord && !prefersReducedMotion) {
    setInterval(() => {
      growthWord.classList.add('sweep-active');
      setTimeout(() => growthWord.classList.remove('sweep-active'), 800);
    }, 5000);
  }

  /* ─── 3. FLOATING ICONS ORBITAL ANIMATION ─── */
  const floatIcons = section.querySelectorAll('.sol-float-icon');
  if (floatIcons.length && !prefersReducedMotion) {
    const iconConfigs = [
      { cx: 120, cy: 60,  rx: 30, ry: 20, speed: 0.0008, phase: 0,     rotSpeed: 0.0003 },
      { cx: 280, cy: 40,  rx: 25, ry: 35, speed: 0.0006, phase: 1.5,   rotSpeed: -0.0004 },
      { cx: 350, cy: 130, rx: 20, ry: 25, speed: 0.001,  phase: 3,     rotSpeed: 0.0002 },
      { cx: 200, cy: 160, rx: 35, ry: 20, speed: 0.0007, phase: 4.5,   rotSpeed: -0.0003 },
      { cx: 70,  cy: 180, rx: 25, ry: 30, speed: 0.0009, phase: 2,     rotSpeed: 0.0005 },
    ];
    let animFrame;
    const animateIcons = (time) => {
      floatIcons.forEach((icon, i) => {
        if (i >= iconConfigs.length) return;
        const c = iconConfigs[i];
        const x = c.cx + Math.sin(time * c.speed + c.phase) * c.rx;
        const y = c.cy + Math.cos(time * c.speed * 1.3 + c.phase) * c.ry;
        const rot = Math.sin(time * c.rotSpeed + c.phase) * 8;
        icon.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
      });
      animFrame = requestAnimationFrame(animateIcons);
    };
    animFrame = requestAnimationFrame(animateIcons);

    // Stop animation when section is out of view
    const sectionObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!animFrame) animFrame = requestAnimationFrame(animateIcons);
      } else {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }, { threshold: 0 });
    sectionObs.observe(section);
  }

  /* ─── 4. STARTUPS CARD — Live Slider Demo ─── */
  const startupsDemo = section.querySelector('.uc-demo-startups');
  if (startupsDemo) {
    const sliders = startupsDemo.querySelectorAll('.demo-slider-row');
    const cursor = startupsDemo.querySelector('.demo-cursor');
    const successPop = startupsDemo.querySelector('.demo-success-pop');
    const configs = [
      { min: 70, max: 95, current: 85 },
      { min: 40, max: 70, current: 55 },
      { min: 75, max: 95, current: 85 },
    ];
    let currentSlider = 0;
    let startupsInterval;

    const animateStartups = () => {
      const row = sliders[currentSlider];
      if (!row) return;
      const fill = row.querySelector('.demo-slider-fill');
      const thumb = row.querySelector('.demo-slider-thumb');
      const valueEl = row.querySelector('.demo-slider-value');
      const cfg = configs[currentSlider];

      // Random new value
      const newVal = cfg.min + Math.floor(Math.random() * (cfg.max - cfg.min));
      cfg.current = newVal;

      // Move cursor to this slider
      if (cursor) {
        const rowRect = row.getBoundingClientRect();
        const demoRect = startupsDemo.getBoundingClientRect();
        cursor.style.top = (rowRect.top - demoRect.top + rowRect.height / 2 - 10) + 'px';
        cursor.style.left = (50 + newVal * 0.8) + '%';
      }

      // Animate fill & thumb
      if (fill) fill.style.width = newVal + '%';
      if (thumb) thumb.style.left = newVal + '%';
      if (valueEl) {
        // Smooth counter
        const startVal = parseInt(valueEl.textContent) || 0;
        const diff = newVal - startVal;
        const steps = 20;
        let step = 0;
        const counterInterval = setInterval(() => {
          step++;
          valueEl.textContent = Math.round(startVal + (diff * step / steps)) + '%';
          if (step >= steps) clearInterval(counterInterval);
        }, 50);
      }

      // Success pop on every 3rd cycle
      if (currentSlider === 2 && successPop) {
        successPop.classList.add('show');
        setTimeout(() => successPop.classList.remove('show'), 1500);
      }

      currentSlider = (currentSlider + 1) % sliders.length;
    };

    startupsInterval = setInterval(animateStartups, 2500);
    setTimeout(animateStartups, 500); // Initial kick
  }

  /* ─── 5. AGENCIES CARD — Live Task Queue ─── */
  const agenciesDemo = section.querySelector('.uc-demo-agencies');
  if (agenciesDemo) {
    const taskList = agenciesDemo.querySelector('.demo-task-list');
    const taskPool = [
      'SEO Audit — Client A',
      'Blog Post Draft',
      'Ad Campaign Setup',
      'Social Calendar',
      'Email Sequence',
      'Landing Page Review',
      'Analytics Report',
      'Competitor Analysis',
      'Content Refresh',
      'Link Building',
    ];
    let taskIdx = 0;
    let currentTasks = [
      { name: 'New campaign launched', status: 'complete' },
      { name: 'SEO rankings improved', status: 'complete' },
      { name: 'Lead pipeline growth', status: 'progress' },
      { name: 'Blog post scheduled', status: 'new' },
    ];

    const statusDotClass = (s) => s === 'complete' ? 'demo-status-dot--done' : s === 'progress' ? 'demo-status-dot--progress' : 'demo-status-dot--new';
    const statusTextClass = (s) => s === 'complete' ? 'demo-task-status--done' : s === 'progress' ? 'demo-task-status--progress' : 'demo-task-status--new';
    const statusLabel = (s) => s === 'complete' ? '✓ Done' : s === 'progress' ? '⏳ Working' : '● New';

    const renderTasks = () => {
      taskList.innerHTML = '';
      currentTasks.forEach((t, i) => {
        const el = document.createElement('div');
        el.className = 'demo-task-item';
        el.style.animationDelay = (i * 0.08) + 's';
        el.innerHTML = `
          <span class="demo-status-dot ${statusDotClass(t.status)}"></span>
          <span class="demo-task-name">${t.name}</span>
          <span class="demo-task-status ${statusTextClass(t.status)}">${statusLabel(t.status)}</span>
        `;
        taskList.appendChild(el);
      });
    };

    renderTasks();

    setInterval(() => {
      // Advance statuses
      currentTasks = currentTasks.map(t => {
        if (t.status === 'new') return { ...t, status: 'progress' };
        if (t.status === 'progress') return { ...t, status: 'complete' };
        return t;
      });
      // Remove oldest complete, add new
      if (currentTasks.filter(t => t.status === 'complete').length > 2) {
        currentTasks.shift();
      }
      const newTaskName = taskPool[taskIdx % taskPool.length];
      taskIdx++;
      currentTasks.push({ name: newTaskName, status: 'new' });
      if (currentTasks.length > 4) currentTasks = currentTasks.slice(-4);
      renderTasks();
    }, 3000);
  }

  /* ─── 6. E-COMMERCE CARD — Live Sales ─── */
  const ecomDemo = section.querySelector('.uc-demo-ecommerce');
  if (ecomDemo) {
    const revenueEl = ecomDemo.querySelector('.demo-revenue-counter');
    const chartBars = ecomDemo.querySelectorAll('.demo-chart-bar');
    const orderArea = ecomDemo.querySelector('.demo-order-area');
    let revenue = 24847;

    const orders = [
      { icon: '📦', text: 'New order', amount: '+$2,140' },
      { icon: '🔍', text: 'SEO sale', amount: '+$5,600' },
      { icon: '🛒', text: 'Abandoned cart', amount: '+$920' },
      { icon: '🔄', text: 'Repeat purchase', amount: '+$1,250' },
      { icon: '📧', text: 'Email campaign', amount: '+$3,400' },
      { icon: '📣', text: 'Ad conversion', amount: '+$1,870' },
    ];
    let orderIdx = 0;

    // Revenue counter
    const updateRevenue = () => {
      const add = Math.floor(Math.random() * 500) + 100;
      const target = revenue + add;
      const start = revenue;
      const duration = 1200;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        revenue = Math.round(start + (target - start) * eased);
        if (revenueEl) revenueEl.textContent = '$' + revenue.toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    // Chart bars
    const updateChart = () => {
      chartBars.forEach(bar => {
        const h = 15 + Math.floor(Math.random() * 85);
        bar.style.height = h + '%';
      });
    };

    // Order notifications
    const showOrder = () => {
      const order = orders[orderIdx % orders.length];
      orderIdx++;
      const el = document.createElement('div');
      el.className = 'demo-order-notification';
      el.innerHTML = `
        <span class="demo-order-icon">${order.icon}</span>
        <span class="demo-order-text">${order.text}</span>
        <span class="demo-order-amount">${order.amount}</span>
      `;
      if (orderArea) {
        orderArea.innerHTML = '';
        orderArea.appendChild(el);
      }
    };

    // Start animations
    updateChart();
    showOrder();
    setInterval(updateRevenue, 2500);
    setInterval(updateChart, 3000);
    setInterval(showOrder, 3500);
  }

  /* ─── 7. ENTERPRISE CARD — Integration Sync ─── */
  const enterpriseDemo = section.querySelector('.uc-demo-enterprise');
  if (enterpriseDemo) {
    const icons = enterpriseDemo.querySelectorAll('.demo-int-icon');
    const badge = enterpriseDemo.querySelector('.demo-status-badge');
    const statuses = [
      { text: '● Syncing...', cls: 'demo-status-badge--syncing' },
      { text: '✓ Connected', cls: '' },
      { text: '↔ Data flowing', cls: '' },
    ];
    let statusIdx = 0;
    let lastPulsed = -1;

    setInterval(() => {
      // Pulse random icon
      if (icons.length) {
        if (lastPulsed >= 0 && icons[lastPulsed]) icons[lastPulsed].classList.remove('pulse-active');
        let next;
        do { next = Math.floor(Math.random() * icons.length); } while (next === lastPulsed && icons.length > 1);
        icons[next].classList.add('pulse-active');
        lastPulsed = next;
      }

      // Rotate status
      statusIdx = (statusIdx + 1) % statuses.length;
      if (badge) {
        badge.textContent = statuses[statusIdx].text;
        badge.className = 'demo-status-badge ' + statuses[statusIdx].cls;
      }
    }, 2000);
  }

  /* ─── 8. HOVER TILT EFFECT ─── */
  if (!prefersReducedMotion) {
    const cards = section.querySelectorAll('.uc-card');
    let lastMoveTime = 0;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        // Throttle to ~60fps
        const now = performance.now();
        if (now - lastMoveTime < 16) return;
        lastMoveTime = now;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const tiltX = (mouseX / (rect.width / 2)) * 2; // max ±2deg
        const tiltY = -(mouseY / (rect.height / 2)) * 2;

        card.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) translateY(-8px) scale(1.01) translateZ(0)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─── 9. CLICK-TO-EXPAND MODAL ─── */
  const modalOverlay = document.getElementById('sol-modal-overlay');
  const modalCard = modalOverlay?.querySelector('.sol-modal-card');
  const modalClose = modalOverlay?.querySelector('.sol-modal-close');
  const modalBody = modalOverlay?.querySelector('.sol-modal-body');

  const modalContents = {
    startups: {
      title: 'Startups & SMBs Dashboard',
      subtitle: 'AI-powered growth metrics for early-stage companies',
      kpis: [
        { value: '+145%', label: 'Traffic Growth', cls: 'positive' },
        { value: '+89%', label: 'Lead Generation', cls: 'positive' },
        { value: '-32%', label: 'Customer Acq. Cost', cls: 'negative' },
      ],
      items: [
        { icon: '🚀', text: 'Auto-scale ad spend based on ROAS thresholds' },
        { icon: '📊', text: 'Weekly AI-generated growth reports' },
        { icon: '🎯', text: 'Smart audience targeting refinement' },
        { icon: '💡', text: 'Content gap analysis and recommendations' },
      ]
    },
    agencies: {
      title: 'Agency Operations Hub',
      subtitle: 'Multi-client management and workflow automation',
      kpis: [
        { value: '94%', label: 'Task Completion', cls: 'positive' },
        { value: '12', label: 'Active Clients', cls: '' },
        { value: '+67%', label: 'Revenue Growth', cls: 'positive' },
      ],
      items: [
        { icon: '👥', text: 'Client A — 14 tasks completed this week' },
        { icon: '📈', text: 'Client B — SEO rankings up 23 positions' },
        { icon: '✉️', text: 'Client C — Email open rate: 42%' },
        { icon: '🎨', text: 'Client D — 8 ad creatives in A/B testing' },
      ]
    },
    ecommerce: {
      title: 'E-commerce Revenue Dashboard',
      subtitle: 'Real-time sales tracking and optimization insights',
      kpis: [
        { value: '$127K', label: 'Monthly Revenue', cls: 'positive' },
        { value: '3.8%', label: 'Conversion Rate', cls: 'positive' },
        { value: '2,847', label: 'Orders This Month', cls: '' },
      ],
      items: [
        { icon: '🏆', text: 'Premium Widget Kit — $34,200 revenue' },
        { icon: '📦', text: 'Starter Bundle — 847 units sold' },
        { icon: '🔥', text: 'Flash Sale Campaign — 156% ROI' },
        { icon: '📧', text: 'Abandoned Cart Recovery — $12,400 saved' },
      ]
    },
    enterprise: {
      title: 'Enterprise Integration Hub',
      subtitle: 'Connected systems and data pipeline monitoring',
      kpis: [
        { value: '16', label: 'Active Integrations', cls: '' },
        { value: '99.9%', label: 'Uptime', cls: 'positive' },
        { value: '2.4M', label: 'Records Synced', cls: '' },
      ],
      items: [
        { icon: '✅', text: 'Salesforce — CRM data syncing (real-time)' },
        { icon: '✅', text: 'HubSpot — Marketing automation connected' },
        { icon: '✅', text: 'Google Analytics — Reporting pipeline active' },
        { icon: '⚡', text: 'Slack — Notifications and alerts enabled' },
      ]
    }
  };

  const openModal = (type) => {
    const content = modalContents[type];
    if (!content || !modalBody || !modalOverlay) return;

    let kpiHTML = content.kpis.map(k => `
      <div class="sol-modal-kpi">
        <div class="sol-modal-kpi-value ${k.cls}">${k.value}</div>
        <div class="sol-modal-kpi-label">${k.label}</div>
      </div>
    `).join('');

    let itemsHTML = content.items.map(item => `
      <li><span class="list-icon">${item.icon}</span> ${item.text}</li>
    `).join('');

    // Chart bars
    const bars = Array.from({length: 7}, () => {
      const h = 20 + Math.floor(Math.random() * 80);
      return `<div class="sol-modal-chart-bar" style="height:${h}%"></div>`;
    }).join('');

    modalBody.innerHTML = `
      <div class="sol-modal-title">${content.title}</div>
      <div class="sol-modal-subtitle">${content.subtitle}</div>
      <div class="sol-modal-insights">${kpiHTML}</div>
      <div class="sol-modal-section-title">Performance Overview</div>
      <div class="sol-modal-chart-placeholder">
        <div class="sol-modal-chart-bars">${bars}</div>
      </div>
      <div class="sol-modal-section-title">AI Insights & Recommendations</div>
      <ul class="sol-modal-list">${itemsHTML}</ul>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modalOverlay) modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Card click handlers
  const cardTypes = ['startups', 'agencies', 'ecommerce', 'enterprise'];
  const cards = section.querySelectorAll('.uc-card');
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      // Don't open if clicking CTA arrow link
      if (e.target.closest('a')) return;
      openModal(cardTypes[i]);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ─── 10. IDLE AUTO-CYCLE MODE ─── */
  let idleTimer = null;
  let idleCycleInterval = null;
  let idleCardIndex = 0;
  let isUserInteracting = false;

  const startIdleCycle = () => {
    if (idleCycleInterval) return;
    idleCardIndex = 0;
    idleCycleInterval = setInterval(() => {
      cards.forEach(c => c.classList.remove('idle-active'));
      if (cards[idleCardIndex]) cards[idleCardIndex].classList.add('idle-active');
      idleCardIndex = (idleCardIndex + 1) % cards.length;
    }, 4000);
  };

  const stopIdleCycle = () => {
    if (idleCycleInterval) {
      clearInterval(idleCycleInterval);
      idleCycleInterval = null;
    }
    cards.forEach(c => c.classList.remove('idle-active'));
  };

  const resetIdleTimer = () => {
    isUserInteracting = true;
    stopIdleCycle();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isUserInteracting = false;
      startIdleCycle();
    }, 5000);
  };

  // Start idle mode initially after 5 seconds
  if (!prefersReducedMotion) {
    idleTimer = setTimeout(startIdleCycle, 5000);

    section.addEventListener('mouseenter', resetIdleTimer);
    section.addEventListener('mousemove', resetIdleTimer);
    section.addEventListener('mouseleave', () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isUserInteracting = false;
        startIdleCycle();
      }, 5000);
    });
  }

});
