'use strict';

const ICON_SUN =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function renderThemeIcon() {
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = isDark ? ICON_SUN : ICON_MOON;
  themeToggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
}

if (themeToggle) {
  renderThemeIcon();
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    renderThemeIcon();
  });
}

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
}

const currentPage = (location.pathname.split('/').pop() || 'index').replace('.html', '');
document.querySelectorAll('.nav a').forEach((link) => {
  if (link.getAttribute('href').replace('.html', '') === currentPage) {
    link.setAttribute('aria-current', 'page');
  }
});

const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    '(`(?:\\\\[\\s\\S]|[^`\\\\])*`|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')',
    '\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b',
    '\\b(const|let|var|function|return|if|else|for|while|do|of|in|new|class|extends|async|await|try|catch|finally|throw|switch|case|break|continue|default|typeof|import|export|from|this)\\b',
    '\\b(true|false|null|undefined|NaN|Infinity)\\b',
    '\\b([A-Za-z_$][\\w$]*)(?=\\s*\\()',
  ].join('|'),
  'g'
);
const TOKEN_CLASSES = ['', 'com', 'str', 'num', 'kw', 'lit', 'fn'];

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code) {
  let html = '';
  let last = 0;
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    html += escapeHtml(code.slice(last, match.index));
    const group = match.findIndex((value, i) => i > 0 && value !== undefined);
    html += `<span class="t-${TOKEN_CLASSES[group]}">${escapeHtml(match[0])}</span>`;
    last = TOKEN_RE.lastIndex;
  }
  return html + escapeHtml(code.slice(last));
}

document.querySelectorAll('pre > code.js').forEach((block) => {
  block.innerHTML = highlight(block.textContent);
});

document.querySelectorAll('.article pre').forEach((pre) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-btn';
  button.textContent = 'Копировать';
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector('code').textContent);
      button.textContent = 'Скопировано ✓';
    } catch (e) {
      button.textContent = 'Не вышло';
    }
    setTimeout(() => {
      button.textContent = 'Копировать';
    }, 1500);
  });
  pre.appendChild(button);
});

const toc = document.getElementById('toc');
const sections = document.querySelectorAll('.article section[id]');

if (toc && sections.length) {
  const title = document.createElement('p');
  title.className = 'toc__title';
  title.textContent = 'На этой странице';
  toc.appendChild(title);

  const links = new Map();
  sections.forEach((section) => {
    const link = document.createElement('a');
    link.href = '#' + section.id;
    link.textContent = section.querySelector('h2').textContent;
    toc.appendChild(link);
    links.set(section, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => link.classList.remove('is-active'));
          links.get(entry.target).classList.add('is-active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}
