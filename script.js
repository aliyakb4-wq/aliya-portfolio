/* ============================================================
   AL­IYA FATHIMA — CYBERSECURITY PORTFOLIO
   script.js — vanilla JS only, no dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGridBackground();
  initTypingAnimation();
  initTerminalFeed();
  initNavbarScroll();
  initMobileMenu();
  initScrollSpy();
  initScrollReveal();
  initSkillBars();
  initScrollProgress();
  initBackToTop();
  initContactForm();
  initFooterYear();
});

/* ------------------------------------------------------------
   1. ANIMATED CYBERSECURITY GRID BACKGROUND
   A moving grid + drifting "data node" points on <canvas>,
   evoking a network / threat-map visual without being noisy.
------------------------------------------------------------- */
function initGridBackground() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, nodes = [];
  const spacing = 46;
  const nodeCount = 55;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }
  makeNodes();

  function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.045)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function drawNodes() {
    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(0, 217, 255, ${0.09 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // points
    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(0, 217, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    drawNodes();
    if (!reduceMotion) requestAnimationFrame(step);
  }

  if (reduceMotion) {
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    drawNodes();
  } else {
    step();
  }
}

/* ------------------------------------------------------------
   2. TYPING ANIMATION — hero role titles
------------------------------------------------------------- */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Aspiring SOC Analyst',
    'Cybersecurity Graduate',
    'Log Analysis & Monitoring',
    'Incident Response — Entry Level'
  ];

  let phraseIndex = 0, charIndex = 0, deleting = false;
  const typeSpeed = 65, deleteSpeed = 35, holdTime = 1400;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, holdTime);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  tick();
}

/* ------------------------------------------------------------
   3. LIVE SOC TERMINAL FEED (hero signature element)
   Simulated security log lines that "stream in" and loop,
   reinforcing the SOC monitoring theme.
------------------------------------------------------------- */
function initTerminalFeed() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const logLines = [
    { tag: 'INFO',  cls: 'tag-info',  text: 'Initializing SOC monitoring dashboard...' },
    { tag: 'OK',    cls: 'tag-ok',    text: 'Firewall ruleset loaded (482 rules)' },
    { tag: 'SCAN',  cls: 'tag-info',  text: 'Wireshark capture started on eth0' },
    { tag: 'WARN',  cls: 'tag-warn',  text: 'Unusual port scan detected — 192.168.1.14' },
    { tag: 'ALERT', cls: 'tag-alert', text: 'Suspicious login attempt blocked — user: admin' },
    { tag: 'OK',    cls: 'tag-ok',    text: 'Endpoint protection: Sophos — status healthy' },
    { tag: 'INFO',  cls: 'tag-info',  text: 'Parsing system logs for anomalies...' },
    { tag: 'OK',    cls: 'tag-ok',    text: 'No malware signatures matched' },
    { tag: 'WARN',  cls: 'tag-warn',  text: 'Phishing email flagged and quarantined' },
    { tag: 'INFO',  cls: 'tag-info',  text: 'Nmap scan complete — 12 hosts, 3 open ports' },
    { tag: 'OK',    cls: 'tag-ok',    text: 'Incident ticket #4471 closed — false positive' },
    { tag: 'INFO',  cls: 'tag-info',  text: 'Awaiting next event...' }
  ];

  const maxLines = 9;
  let i = 0;
  let active = [];

  function timestamp() {
    const d = new Date();
    return d.toTimeString().slice(0, 8);
  }

  function pushLine() {
    const log = logLines[i % logLines.length];
    i++;

    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-dim">[${timestamp()}]</span> <span class="${log.cls}">[${log.tag}]</span> ${escapeHTML(log.text)}`;
    body.appendChild(line);
    active.push(line);

    if (active.length > maxLines) {
      const old = active.shift();
      old.remove();
    }

    body.scrollTop = body.scrollHeight;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Seed a couple of lines immediately, then continue on an interval
  pushLine();
  setTimeout(pushLine, 400);
  setInterval(pushLine, 1900);
}

/* ------------------------------------------------------------
   4. NAVBAR: solid background after scrolling
------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const toggle = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ------------------------------------------------------------
   5. MOBILE MENU TOGGLE
------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ------------------------------------------------------------
   6. SCROLLSPY — highlight active nav link based on section
------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ------------------------------------------------------------
   7. SCROLL REVEAL — fade/slide elements into view
------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-up');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* ------------------------------------------------------------
   8. SKILL PROGRESS BARS — animate fill + counter on scroll
------------------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-item');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const fill = item.querySelector('.skill-bar-fill');
      const percentEl = item.querySelector('.skill-percent');
      const target = parseInt(fill.dataset.width, 10);

      fill.style.width = target + '%';
      animateCount(percentEl, target);

      observer.unobserve(item);
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));

  function animateCount(el, target) {
    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      current = Math.round(progress * target);
      el.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}

/* ------------------------------------------------------------
   9. SCROLL PROGRESS BAR (top of page)
------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ------------------------------------------------------------
   10. BACK TO TOP BUTTON
------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ------------------------------------------------------------
   11. CONTACT FORM — delivers via Web3Forms (web3forms.com)
   Static site, no backend/database of our own: Web3Forms is a
   free third-party API that emails the submission straight to
   the inbox tied to the access_key hidden field in the HTML.
   Falls back to a mailto link if the request fails (e.g. no
   access key configured yet, or the visitor is offline).
------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  const submitBtn = document.getElementById('cf-submit');
  const submitText = document.getElementById('cf-submit-text');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();
    const accessKey = form.querySelector('[name="access_key"]').value.trim();

    // If no real access key has been configured yet, skip straight to the
    // mailto fallback rather than firing a request that's guaranteed to fail.
    if (!accessKey || accessKey === 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      mailtoFallback(name, email, message);
      return;
    }

    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: accessKey, name, email, message,
          subject: `New portfolio contact — message from ${name}` })
      });
      const result = await res.json();

      if (result.success) {
        form.reset();
        submitText.textContent = 'Send Message';
        note.textContent = 'Message sent — thank you! I\'ll get back to you soon.';
        note.style.color = 'var(--success)';
      } else {
        throw new Error(result.message || 'Delivery failed');
      }
    } catch (err) {
      mailtoFallback(name, email, message);
    } finally {
      submitBtn.disabled = false;
      if (submitText.textContent === 'Sending...') submitText.textContent = 'Send Message';
    }
  });

  function mailtoFallback(name, email, message) {
    const subject = encodeURIComponent(`Opportunity — message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:aliyakb4@gmail.com?subject=${subject}&body=${body}`;
    if (note) {
      note.textContent = 'Opening your email app instead — direct delivery isn\'t set up yet.';
      note.style.color = 'var(--text-3)';
    }
  }
}

/* ------------------------------------------------------------
   12. FOOTER — current year
------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
