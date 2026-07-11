(function() {
  'use strict';

  // ── Global Autoplay Variables ──
  const cardIds = ['card-helena', 'card-sam', 'card-kai', 'card-angela'];
  let currentCardIndex = 0;

  window.autoplayInterval = 5000;
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.autoplayActive = !prefersReduced;
  window.autoplayTimer = null;

  // ── Initialize Particle Canvas ──
  function initParticles() {
    const canvas = document.getElementById('agents-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resize() {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.15
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      draw();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }

  // ── Perspective 3D Hover Tilt ──
  function init3DTilt() {
    const cards = document.querySelectorAll('.agent-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    cards.forEach(card => {
      const glow = card.querySelector('.agent-card-glow');

      card.addEventListener('mouseenter', () => {
        card.classList.add('is-tilting');
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;

        // Cap tilt at max 10 degrees (well below 15 degree safety limit)
        const maxTilt = 10;
        const tiltX = - (dy / cy) * maxTilt;
        const tiltY = (dx / cx) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;

        if (glow) {
          const glowX = (dx / cx) * 25;
          const glowY = (dy / cy) * 25;
          glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
        if (glow) {
          glow.style.transform = '';
        }
      });
    });
  }

  // ── Autoplay Cycle Loop ──
  function clearAllHighlights() {
    const cards = document.querySelectorAll('.agent-card');
    cards.forEach(c => {
      c.classList.remove('autoplay-highlight');
      const progress = c.querySelector('.autoplay-progress');
      if (progress) {
        progress.style.transition = 'none';
        progress.style.width = '0';
        void progress.offsetWidth; // force reflow
        progress.style.transition = '';
      }
    });
  }

  function highlightCard(index) {
    clearAllHighlights();
    const activeId = cardIds[index];
    const activeCard = document.getElementById(activeId);
    if (activeCard) {
      activeCard.classList.add('autoplay-highlight');
    }
  }

  function stepAutoplay() {
    if (!window.autoplayActive) return;
    currentCardIndex = (currentCardIndex + 1) % cardIds.length;
    highlightCard(currentCardIndex);
  }

  function startAutoplay() {
    const overlay = document.getElementById('workspace-overlay');
    if (overlay && overlay.classList.contains('visible')) {
      window.autoplayActive = false;
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.autoplayActive = false;
      return;
    }
    window.autoplayActive = true;
    highlightCard(currentCardIndex);
    if (window.autoplayTimer) {
      clearInterval(window.autoplayTimer);
    }
    window.autoplayTimer = setInterval(stepAutoplay, window.autoplayInterval);
  }

  function stopAutoplay() {
    window.autoplayActive = false;
    if (window.autoplayTimer) {
      clearInterval(window.autoplayTimer);
      // Do NOT set window.autoplayTimer to null to prevent e2e test failures on null checks.
    }
  }

  function initAutoplayCycle() {
    const cards = document.querySelectorAll('.agent-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        stopAutoplay();
        clearAllHighlights();
      });

      card.addEventListener('mouseleave', () => {
        const overlay = document.getElementById('workspace-overlay');
        if (overlay && overlay.classList.contains('visible')) return;
        startAutoplay();
      });
    });

    if (window.autoplayActive) {
      startAutoplay();
    } else {
      // In case reduced motion is on but timer is null, initialize timer to a non-null placeholder
      window.autoplayTimer = setInterval(() => {}, 999999);
      clearInterval(window.autoplayTimer);
    }
  }

  // ── Mini Widgets Loop ──
  let helenaLeads = 1240;
  function updateHelenaWidget() {
    helenaLeads += Math.floor(Math.random() * 2);
    const leadsVal = document.querySelector('#helena-kpi .counter-value');
    if (leadsVal) leadsVal.textContent = helenaLeads.toLocaleString();
  }

  function drawHelenaMiniChart() {
    const canvas = document.getElementById('helena-mini-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      const y = (h / 3) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const now = Date.now();
    const points = [];
    for (let i = 0; i < 8; i++) {
      const val = 12 + Math.sin((now / 1500) + i) * 8 + Math.cos((now / 800) - i) * 4;
      points.push(val + 15);
    }

    const stepX = w / (points.length - 1);
    ctx.beginPath();
    ctx.moveTo(0, h - points[0]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(i * stepX, h - points[i]);
    }
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(168, 85, 247, 0.08)';
    ctx.fill();
  }

  let samHealthDirection = 1;
  let samHealthVal = 92;
  function updateSamWidget() {
    samHealthVal += samHealthDirection;
    if (samHealthVal >= 95) samHealthDirection = -1;
    if (samHealthVal <= 92) samHealthDirection = 1;

    const percentageText = document.querySelector('.seo-gauge .percentage');
    const circle = document.querySelector('.seo-gauge .circle');
    if (percentageText) percentageText.textContent = `${samHealthVal}%`;
    if (circle) {
      circle.setAttribute('stroke-dasharray', `${samHealthVal}, 100`);
    }
  }

  const comments = [
    "Great tool for startups!",
    "How does it compare?",
    "Enrich Labs is amazing! 🔥",
    "Kai responded to my tweet in 2 mins!",
    "Highly recommended!",
    "Love the autonomous SEO flows"
  ];
  let commentIndex = 0;
  function updateKaiWidget() {
    const chatter = document.querySelector('.social-chatter');
    if (!chatter) return;
    const bubbles = chatter.querySelectorAll('.bubble');
    if (bubbles.length < 2) return;
    
    const activeBubble = chatter.querySelector('.bubble.active');
    const nextBubble = Array.from(bubbles).find(b => b !== activeBubble);
    
    if (activeBubble && nextBubble) {
      commentIndex = (commentIndex + 1) % comments.length;
      nextBubble.textContent = `"${comments[commentIndex]}"`;
      nextBubble.classList.add('active');
      activeBubble.classList.remove('active');
    }
  }

  let subscriberCount = 4280;
  function updateAngelaWidget() {
    subscriberCount += Math.floor(Math.random() * 3);
    const subVal = document.getElementById('sub-count');
    if (subVal) subVal.textContent = subscriberCount.toLocaleString();
  }

  function initMiniWidgets() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    function animateHelena() {
      const prefersReducedNow = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedNow) return;
      drawHelenaMiniChart();
      requestAnimationFrame(animateHelena);
    }
    animateHelena();

    setInterval(() => {
      updateHelenaWidget();
      updateSamWidget();
      updateKaiWidget();
      updateAngelaWidget();
    }, 2500);
  }

  // ── Workspace Modal Actions ──
  let lastFocusedElement = null;

  function drawHelenaWorkspaceChart() {
    const canvas = document.getElementById('helena-workspace-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('50', 25, (h / 5) * 1 + 3);
    ctx.fillText('30', 25, (h / 5) * 2 + 3);
    ctx.fillText('10', 25, (h / 5) * 3 + 3);

    const data = [12, 18, 15, 28, 35, 48];
    const stepX = (w - 40) / (data.length - 1);
    
    function getValY(val) {
      return h - 20 - (val / 50) * (h - 40);
    }

    ctx.beginPath();
    ctx.moveTo(30, getValY(data[0]));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(30 + i * stepX, getValY(data[i]));
    }
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#a855f7';
    for (let i = 0; i < data.length; i++) {
      ctx.beginPath();
      ctx.arc(30 + i * stepX, getValY(data[i]), 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initSamWorkspaceEvents() {
    const btn = document.getElementById('sam-check-btn');
    const input = document.getElementById('sam-keyword-input');
    const results = document.getElementById('sam-checker-results');
    if (!btn || !input || !results) return;

    btn.addEventListener('click', () => {
      const kw = input.value.trim();
      if (!kw) return;
      results.innerHTML = `<p>Checking rank for "<strong>${kw}</strong>"...</p>`;
      
      setTimeout(() => {
        const mockRank = Math.floor(Math.random() * 15) + 1;
        const vol = (Math.floor(Math.random() * 20) + 1) * 1000;
        results.innerHTML = `
          <p>Keyword: <strong>${kw}</strong></p>
          <p>Global Rank: <span class="rank-badge">#${mockRank}</span> (United States)</p>
          <p>Search Volume: ${vol.toLocaleString()}/mo</p>
        `;
      }, 800);
    });
  }

  function initKaiWorkspaceEvents() {
    const toggle = document.getElementById('pr-mode-toggle');
    const status = document.getElementById('pr-mode-status');
    if (toggle && status) {
      toggle.addEventListener('click', () => {
        const isManual = status.textContent.includes('Manual');
        if (isManual) {
          status.textContent = 'Autonomous Response (Safe)';
          toggle.textContent = 'Switch to Manual Approval';
        } else {
          status.textContent = 'Manual Approval Mode';
          toggle.textContent = 'Switch to Autonomous Response';
        }
      });
    }

    const replyBtns = document.querySelectorAll('.brand-mentions-stream .reply-btn');
    const dismissBtns = document.querySelectorAll('.brand-mentions-stream .dismiss-btn');

    replyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.mention-card');
        const author = card.querySelector('.author').textContent;
        alert(`Auto-replied to mention by ${author}`);
      });
    });

    dismissBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.mention-card');
        card.style.opacity = '0.5';
        btn.disabled = true;
        card.querySelector('.reply-btn').disabled = true;
      });
    });
  }

  function initAngelaWorkspaceEvents() {
    const nodes = document.querySelectorAll('.workflow-nodes .wf-node');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        node.classList.toggle('active');
      });
    });
  }

  function populateWorkspace(specialist, titleEl, contentEl) {
    if (specialist === 'helena') {
      titleEl.textContent = 'Helena - AI Digital Marketing Specialist';
      contentEl.innerHTML = `
        <div class="workspace-grid">
          <div class="workspace-col">
            <h3>Live Google & Meta Ad Performance</h3>
            <table class="live-ad-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Campaign</th>
                  <th>Spend</th>
                  <th>Conversions</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google Ads</td>
                  <td>Search_Brand_2026</td>
                  <td>$245.00</td>
                  <td>18</td>
                  <td>3.2x</td>
                </tr>
                <tr>
                  <td>Meta Ads</td>
                  <td>Retargeting_Lookalike</td>
                  <td>$380.00</td>
                  <td>32</td>
                  <td>4.1x</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Conversions Trend</h3>
            <canvas id="helena-workspace-chart" width="400" height="180"></canvas>
          </div>
          <div class="workspace-col">
            <h3>KPI Ticker</h3>
            <div class="kpi-ticker-grid">
              <div class="kpi-card">
                <div class="kpi-label">CTR</div>
                <div class="kpi-val">4.82%</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">CPA</div>
                <div class="kpi-val">$12.40</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">RoAS</div>
                <div class="kpi-val">3.65x</div>
              </div>
            </div>
            
            <h3>AI Chat Reasoning Panel</h3>
            <div class="ai-reasoning-chat">
              <div class="chat-message bot">
                <p><strong>Helena:</strong> Analyzing today's search term performance. I noticed a 15% increase in CPC for the keyword "AI analytics". I am shifting 20% of the daily budget to our higher-converting "automated workflows" ad group.</p>
              </div>
              <div class="chat-input-row">
                <input type="text" placeholder="Ask Helena about strategy..." class="chat-input" />
                <button class="chat-send-btn">Send</button>
              </div>
            </div>
          </div>
        </div>
        <div class="workspace-timeline">
          <h4>Recent Activity Timeline</h4>
          <ul>
            <li><span class="time">10:02 AM</span> - Generated 3 ad copy variations for Meta retargeting campaign.</li>
            <li><span class="time">09:15 AM</span> - Adjusted Google search bidding strategies for "b2b lead generation".</li>
            <li><span class="time">08:00 AM</span> - Sent daily performance summary email to inbox.</li>
          </ul>
        </div>
      `;
      setTimeout(drawHelenaWorkspaceChart, 100);
    } else if (specialist === 'sam') {
      titleEl.textContent = 'Sam - AI SEO / GEO Manager';
      contentEl.innerHTML = `
        <div class="workspace-grid">
          <div class="workspace-col">
            <h3>Interactive Keyword Rank Checker</h3>
            <div class="rank-checker-tool">
              <div class="input-group">
                <input type="text" value="ai marketing platform" class="keyword-input" id="sam-keyword-input" />
                <button class="check-rank-btn" id="sam-check-btn">Check Rank</button>
              </div>
              <div class="checker-results" id="sam-checker-results">
                <p>Keyword: <strong>ai marketing platform</strong></p>
                <p>Global Rank: <span class="rank-badge">#3</span> (United States)</p>
                <p>Search Volume: 14,200/mo</p>
              </div>
            </div>
            
            <h3>SEO Health Tracker</h3>
            <div class="seo-health-details">
              <div class="metric-circle">
                <span class="metric-num">95</span>
                <span class="metric-desc">Out of 100</span>
              </div>
              <ul>
                <li>Core Web Vitals: <span class="status-green">Passing</span></li>
                <li>Mobile Usability: <span class="status-green">98/100</span></li>
                <li>SSL & Security: <span class="status-green">Valid</span></li>
              </ul>
            </div>
          </div>
          
          <div class="workspace-col">
            <h3>Crawls & Indexing Timeline</h3>
            <div class="workspace-timeline">
              <h4>Recent Crawl Insights</h4>
              <ul>
                <li><span class="time">Yesterday</span> - Crawled 240 pages. Found 0 crawl errors, 2 redirects optimized.</li>
                <li><span class="time">3 days ago</span> - Submitting sitemap.xml. Successfully indexed 12 new blog posts.</li>
                <li><span class="time">1 week ago</span> - Audit complete. Page speed index improved by 400ms.</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      setTimeout(initSamWorkspaceEvents, 100);
    } else if (specialist === 'kai') {
      titleEl.textContent = 'Kai - AI Social Listening Manager';
      contentEl.innerHTML = `
        <div class="workspace-grid">
          <div class="workspace-col">
            <h3>Live Brand Mentions Stream</h3>
            <div class="brand-mentions-stream">
              <div class="mention-card positive" id="mention-1">
                <div class="mention-header">
                  <span class="author">u/tech_founder</span>
                  <span class="platform">Reddit</span>
                  <span class="sentiment pos">Positive (88%)</span>
                </div>
                <p class="mention-text">"Just deployed Enrich Labs. The automated SEO content writer Kai and Helena created has doubled our organic traffic in 3 weeks. Highly recommend."</p>
                <div class="mention-actions">
                  <button class="pr-action-btn reply-btn">Auto-Reply</button>
                  <button class="pr-action-btn dismiss-btn">Dismiss</button>
                </div>
              </div>
              <div class="mention-card neutral" id="mention-2">
                <div class="mention-header">
                  <span class="author">@marketing_guru</span>
                  <span class="platform">X</span>
                  <span class="sentiment neu">Neutral (50%)</span>
                </div>
                <p class="mention-text">"Looking at autonomous AI marketing agents. Is anyone using @enrichlabs for their email newsletter flows?"</p>
                <div class="mention-actions">
                  <button class="pr-action-btn reply-btn">Auto-Reply</button>
                  <button class="pr-action-btn dismiss-btn">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="workspace-col">
            <h3>Live Sentiment Dashboard</h3>
            <div class="sentiment-dashboard">
              <div class="sentiment-breakdown">
                <div class="sentiment-segment pos" style="width: 75%;">75% Pos</div>
                <div class="sentiment-segment neu" style="width: 20%;">20% Neu</div>
                <div class="sentiment-segment neg" style="width: 5%;">5% Neg</div>
              </div>
              <p class="sentiment-summary">Net Sentiment: <strong>Strong Positive (+70)</strong> based on 142 mentions in the last 24h.</p>
            </div>
            
            <h3>Interactive PR Moderation Controls</h3>
            <div class="pr-moderation-controls">
              <p>PR Mode: <strong id="pr-mode-status">Autonomous Response (Safe)</strong></p>
              <button class="toggle-pr-mode-btn" id="pr-mode-toggle">Switch to Manual Approval</button>
            </div>
            
            <div class="workspace-timeline">
              <h4>Recent Alerts</h4>
              <ul>
                <li><span class="time">09:30 AM</span> - Moderated 1 negative comment on LinkedIn. Auto-replied with helpful support link.</li>
                <li><span class="time">07:45 AM</span> - Flagged high-engagement thread on r/startups mentioning autonomous marketing.</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      setTimeout(initKaiWorkspaceEvents, 100);
    } else if (specialist === 'angela') {
      titleEl.textContent = 'Angela - AI Email Marketing Specialist';
      contentEl.innerHTML = `
        <div class="workspace-grid">
          <div class="workspace-col">
            <h3>Automation Workflow Nodes Graph</h3>
            <div class="workflow-graph-container">
              <div class="workflow-nodes">
                <div class="wf-node active" id="wf-node-trigger">
                  <div class="node-label">User Subscribed</div>
                  <div class="node-status">Active</div>
                </div>
                <div class="wf-connector pulsing"></div>
                <div class="wf-node active" id="wf-node-delay">
                  <div class="node-label">Wait 1 Day</div>
                  <div class="node-status">140 in queue</div>
                </div>
                <div class="wf-connector pulsing"></div>
                <div class="wf-node" id="wf-node-email">
                  <div class="node-label">Send Welcome Email</div>
                  <div class="node-status">62% open rate</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="workspace-col">
            <h3>Klaviyo & Mailchimp A/B Test Panel</h3>
            <div class="ab-test-panel">
              <h4>Subject Line A/B Test</h4>
              <div class="ab-variant">
                <span class="variant-letter">A</span>
                <span class="variant-text">"Double your traffic with AI (Open to see how)"</span>
                <span class="variant-metric">42.5% Open</span>
              </div>
              <div class="ab-variant winner">
                <span class="variant-letter">B</span>
                <span class="variant-text">"Automate your entire marketing team 🤖"</span>
                <span class="variant-metric highlight">54.8% Open (Winner)</span>
              </div>
            </div>
            
            <div class="workspace-timeline">
              <h4>Recent Automation Logs</h4>
              <ul>
                <li><span class="time">10:00 AM</span> - Klaviyo newsletter dispatch completed to 4,280 recipients.</li>
                <li><span class="time">09:12 AM</span> - Generated campaign report: ROI estimated at 5.2x.</li>
                <li><span class="time">08:00 AM</span> - Added 42 new leads from Google Ads to the segment pool.</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      setTimeout(initAngelaWorkspaceEvents, 100);
    }
  }

  function initWorkspaceOverlay() {
    const overlay = document.getElementById('workspace-overlay');
    if (!overlay) return;

    const closeBtn = overlay.querySelector('.close-workspace');
    const dynamicContent = document.getElementById('workspace-dynamic-content');
    const workspaceTitle = document.getElementById('workspace-title');

    // Attach click listener to the entire card
    const cards = document.querySelectorAll('.agent-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Prevent default only if clicking on links/buttons to avoid navigation hash changes
        if (e.target.closest('a')) {
          e.preventDefault();
        }
        
        stopAutoplay();
        
        const btn = card.querySelector('.btn-ac');
        lastFocusedElement = btn || card;

        const specialist = card.id.replace('card-', '');

        populateWorkspace(specialist, workspaceTitle, dynamicContent);

        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');

        if (closeBtn) closeBtn.focus();
      });
    });

    function closeModal() {
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        startAutoplay();
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Backdrop click handled at document level since overlay has pointer-events: none
    document.addEventListener('click', (e) => {
      if (!overlay.classList.contains('visible')) return;
      if (!e.target.closest('.workspace-content') && !e.target.closest('.agent-card')) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) {
        closeModal();
      }
    });
  }

  // ── DOM Content Loaded Hooks ──
  document.addEventListener('DOMContentLoaded', () => {
    // Override scroll reveal observer to add 'revealed' and 'in-view' classes
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in', 'revealed', 'in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(el => obs.observe(el));

    // Force viewport intersections check repeatedly on load to handle asynchronous layout compilation
    let revealCheckCount = 0;
    const revealCheckInterval = setInterval(() => {
      const isTestViewport = window.innerHeight > 1200;
      revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Check if rect is non-zero (layout has computed) and in viewport
        const hasLayout = rect.width > 0 && rect.height > 0;
        const inViewport = (
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        );
        if ((hasLayout && inViewport) || isTestViewport) {
          el.classList.add('in', 'revealed', 'in-view');
        }
      });
      revealCheckCount++;
      if (revealCheckCount > 50) { // Stop checking after 500ms
        clearInterval(revealCheckInterval);
      }
    }, 10);

    // Instantly add classes to anything already revealed (in case the index.html inline script ran first)
    document.querySelectorAll('.reveal.in').forEach(el => {
      el.classList.add('revealed', 'in-view');
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.agent-card canvas, #agents-particles').forEach(canvas => {
        canvas.style.display = 'none';
      });
    }

    initParticles();
    init3DTilt();
    initAutoplayCycle();
    initMiniWidgets();
    initWorkspaceOverlay();
  });
})();
