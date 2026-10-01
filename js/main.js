/* ==========================================================================
   Varad Paradkar — portfolio behaviour
   No dependencies, no build step. Everything here is progressive: the page
   is complete and readable with this file blocked.
   ========================================================================== */

(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Theme --------------------------------------------------------------
     The initial theme is applied by an inline script in <head> to avoid a
     flash; this only handles switching and persistence.                    */
  const themeToggle = $('#themeToggle');

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
  };

  setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  // Follow the OS only while the visitor hasn't made an explicit choice.
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
    if (!stored) setTheme(e.matches ? 'light' : 'dark');
  });

  /* --- Header state + scroll progress ------------------------------------ */
  const header   = $('#siteHeader');
  const progress = $('#scrollProgress');
  let scrollQueued = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);

    if (progress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = scrollable > 0 ? `${(y / scrollable) * 100}%` : '0%';
    }
    scrollQueued = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /* --- Mobile menu ------------------------------------------------------- */
  const menuToggle = $('#menuToggle');
  const nav        = $('.site-nav');

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    $$('.nav-list a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') &&
          !e.target.closest('.site-nav') &&
          !e.target.closest('#menuToggle')) {
        closeMenu();
      }
    });

    // A resize past the breakpoint leaves the menu stuck open otherwise.
    matchMedia('(min-width: 801px)').addEventListener('change', (e) => {
      if (e.matches) closeMenu();
    });
  }

  /* --- Scroll reveal ----------------------------------------------------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = $$('.section-head, .card, .stat-strip, .timeline .tl-item');
    targets.forEach((el) => el.classList.add('reveal'));

    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => revealer.observe(el));
  }

  /* --- Nav scrollspy ----------------------------------------------------- */
  const navLinks = new Map();
  $$('.nav-list a[href^="#"]').forEach((link) => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) navLinks.set(section, link);
  });

  if (navLinks.size && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = navLinks.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    navLinks.forEach((_link, section) => spy.observe(section));
  }

  /* --- Footer year ------------------------------------------------------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- GitHub repositories ----------------------------------------------
     Best-effort enrichment. The section stays hidden unless the request
     succeeds, so a rate-limited or offline visitor sees no broken shell.  */
  const GH_USER     = 'vradcar';
  const GH_CACHE_KEY = 'gh-repos-v1';
  const GH_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
  const GH_LIMIT     = 6;

  // An undescribed or scratch repository reads worse than no repository at all,
  // so the section only appears once enough repos carry a real description.
  const GH_MIN = 3;

  // Already covered in depth by the hand-written cards above.
  const GH_SKIP = new Set(['vradcar', 'vradcar.github.io', 'git-home-portfolio']);

  const icon = (id) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ico');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#i-${id}`);
    svg.appendChild(use);
    return svg;
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  function buildRepoCard(repo) {
    const card = el('article', 'card project-card');
    card.appendChild(el('h4', null, repo.name));
    card.appendChild(el('p', null, repo.description));

    const meta = el('div', 'gh-meta');
    if (repo.language) meta.appendChild(el('span', 'gh-lang', repo.language));

    const stars = el('span');
    stars.append(icon('star'), document.createTextNode(String(repo.stargazers_count)));
    meta.appendChild(stars);

    const forks = el('span');
    forks.append(icon('fork'), document.createTextNode(String(repo.forks_count)));
    meta.appendChild(forks);

    card.appendChild(meta);

    const topics = (repo.topics || []).slice(0, 5);
    if (topics.length) {
      const tags = el('ul', 'tags tags-sm');
      topics.forEach((topic) => tags.appendChild(el('li', null, topic)));
      card.appendChild(tags);
    }

    const links = el('p', 'card-links');
    const code = el('a');
    code.href = repo.html_url;
    code.target = '_blank';
    code.rel = 'noopener';
    code.append(icon('github'), document.createTextNode('Code'));
    links.appendChild(code);

    if (repo.homepage) {
      const demo = el('a');
      demo.href = repo.homepage;
      demo.target = '_blank';
      demo.rel = 'noopener';
      demo.append(icon('external'), document.createTextNode('Live'));
      links.appendChild(demo);
    }

    card.appendChild(links);
    return card;
  }

  function renderRepos(repos) {
    const section = $('#githubSection');
    const grid    = $('#githubGrid');
    if (!section || !grid || repos.length < GH_MIN) return;

    grid.replaceChildren(...repos.map(buildRepoCard));
    section.hidden = false;
  }

  function pickRepos(repos) {
    return repos
      .filter((r) => !r.fork && !r.archived && !GH_SKIP.has(r.name.toLowerCase()))
      .filter((r) => r.description && r.description.trim())
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, GH_LIMIT)
      .map(({ name, description, language, topics, html_url, homepage,
              stargazers_count, forks_count, pushed_at }) => ({
        name, description, language, topics, html_url, homepage,
        stargazers_count, forks_count, pushed_at
      }));
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(GH_CACHE_KEY);
      if (!raw) return null;
      const { at, repos } = JSON.parse(raw);
      return Date.now() - at < GH_CACHE_TTL ? repos : null;
    } catch (e) {
      return null;
    }
  }

  async function loadRepos() {
    const cached = readCache();
    if (cached) { renderRepos(cached); return; }

    try {
      const res = await fetch(
        `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);

      const repos = pickRepos(await res.json());
      renderRepos(repos);

      try {
        localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
      } catch (e) { /* storage full or blocked — the render already happened */ }
    } catch (err) {
      // Nothing to show: the section stays hidden rather than rendering an error.
      console.warn('Could not load GitHub repositories:', err.message);
    }
  }

  loadRepos();
})();
