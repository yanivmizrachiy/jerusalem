import crypto from 'node:crypto';

const REPO = process.env.TARGET_REPO || 'yanivmizrachiy/jerusalem';
const BRANCH = process.env.TARGET_BRANCH || 'main';
const TARGET_FILE = process.env.TARGET_FILE || 'src/components/Booklet.astro';
const LIVE_SITE_URL = process.env.LIVE_SITE_URL || 'https://jerusalem-virid.vercel.app/chativat-beynayim/';
const ALLOWED_LOGIN = (process.env.ALLOWED_GITHUB_LOGIN || 'yanivmizrachiy').toLowerCase();
const ALLOWED_ID = String(process.env.ALLOWED_GITHUB_ID || '203164631');
const SESSION_COOKIE = '__Host-jws_session';
const STATE_COOKIE = '__Host-jws_oauth_state';
const START_PREFIX = '<!-- WORKBOOK-STUDIO:START ';
const START_RE = /<!-- WORKBOOK-STUDIO:START ([A-Za-z0-9_-]+) -->[\s\S]*?<!-- WORKBOOK-STUDIO:END -->/m;

const DEFAULT_THEME = Object.freeze({
  version: 1,
  name: 'ירושלים זהב',
  colors: {
    paper: '#fffdf7',
    ink: '#182033',
    muted: '#5f6877',
    accent: '#c89b3c',
    accentText: '#172033',
    toolbar: '#fffaf0',
    toolbarText: '#2a3446',
    stage: '#efe9dd',
    border: '#d8caa9',
    gradeZ: '#1d7ed8',
    gradeH: '#059669',
    gradeT: '#7c3aed',
    danger: '#b42318'
  },
  typography: {
    headingFont: 'Frank Ruhl Libre',
    bodyFont: 'Heebo Variable',
    titleScale: 1,
    bodyScale: 1,
    lineHeight: 1.46,
    weight: 500
  },
  layout: {
    shellMax: 1880,
    stageHeight: 76,
    pageRadius: 16,
    panelRadius: 18,
    contentPadding: 24,
    gap: 12,
    railWidth: 108,
    navSize: 44,
    borderWidth: 1
  },
  effects: {
    shadow: 34,
    blur: 12,
    saturation: 100,
    texture: 'paper',
    motion: 'full',
    tabStyle: 'pill'
  },
  accessibility: {
    highContrast: false,
    largeTargets: false,
    underlineLinks: false,
    strongFocus: true
  },
  customCss: ''
});

const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
};

const safeColor = (value, fallback) => {
  const text = String(value || '').trim();
  return /^(#[0-9a-f]{3,8}|rgb\([^)]{1,80}\)|rgba\([^)]{1,80}\)|hsl\([^)]{1,80}\)|hsla\([^)]{1,80}\))$/i.test(text)
    ? text
    : fallback;
};

const safeEnum = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;

function sanitizeCustomCss(value) {
  const css = String(value || '').trim().slice(0, 12000);
  if (!css) return '';
  const forbidden = /<\/style|@import|@font-face|javascript:|expression\s*\(|behavior\s*:|url\s*\(\s*['"]?data:/i;
  if (forbidden.test(css)) throw new Error('ה-CSS האישי מכיל פקודה שאינה מותרת.');

  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = withoutComments.match(/[^{}]+\{[^{}]*\}/g) || [];
  if (!blocks.length || blocks.join('').replace(/\s/g, '').length !== withoutComments.replace(/\s/g, '').length) {
    throw new Error('ה-CSS האישי חייב להכיל כללים פשוטים ללא קינון.');
  }
  for (const block of blocks) {
    const selector = block.slice(0, block.indexOf('{')).trim();
    const selectors = selector.split(',').map((s) => s.trim());
    if (selectors.some((s) => !(s.startsWith('[data-book]') || s.startsWith('html.book-lock')))) {
      throw new Error('כל בורר CSS אישי חייב להתחיל ב-[data-book] או ב-html.book-lock.');
    }
  }
  return css;
}

function normalizeTheme(input = {}) {
  const d = DEFAULT_THEME;
  const colors = input.colors || {};
  const typography = input.typography || {};
  const layout = input.layout || {};
  const effects = input.effects || {};
  const accessibility = input.accessibility || {};

  return {
    version: 1,
    name: String(input.name || d.name).trim().slice(0, 80) || d.name,
    colors: Object.fromEntries(Object.entries(d.colors).map(([key, fallback]) => [key, safeColor(colors[key], fallback)])),
    typography: {
      headingFont: safeEnum(typography.headingFont, ['Frank Ruhl Libre', 'Heebo Variable', 'Arial', 'Georgia', 'system-ui'], d.typography.headingFont),
      bodyFont: safeEnum(typography.bodyFont, ['Heebo Variable', 'Arial', 'system-ui', 'Assistant'], d.typography.bodyFont),
      titleScale: clamp(typography.titleScale, 0.7, 1.8, d.typography.titleScale),
      bodyScale: clamp(typography.bodyScale, 0.78, 1.45, d.typography.bodyScale),
      lineHeight: clamp(typography.lineHeight, 1.1, 2, d.typography.lineHeight),
      weight: clamp(typography.weight, 300, 800, d.typography.weight)
    },
    layout: {
      shellMax: clamp(layout.shellMax, 980, 2400, d.layout.shellMax),
      stageHeight: clamp(layout.stageHeight, 52, 92, d.layout.stageHeight),
      pageRadius: clamp(layout.pageRadius, 0, 40, d.layout.pageRadius),
      panelRadius: clamp(layout.panelRadius, 0, 40, d.layout.panelRadius),
      contentPadding: clamp(layout.contentPadding, 8, 56, d.layout.contentPadding),
      gap: clamp(layout.gap, 0, 32, d.layout.gap),
      railWidth: clamp(layout.railWidth, 84, 180, d.layout.railWidth),
      navSize: clamp(layout.navSize, 36, 64, d.layout.navSize),
      borderWidth: clamp(layout.borderWidth, 0, 4, d.layout.borderWidth)
    },
    effects: {
      shadow: clamp(effects.shadow, 0, 80, d.effects.shadow),
      blur: clamp(effects.blur, 0, 30, d.effects.blur),
      saturation: clamp(effects.saturation, 60, 150, d.effects.saturation),
      texture: safeEnum(effects.texture, ['none', 'paper', 'dots', 'grid'], d.effects.texture),
      motion: safeEnum(effects.motion, ['full', 'soft', 'none'], d.effects.motion),
      tabStyle: safeEnum(effects.tabStyle, ['pill', 'soft', 'square'], d.effects.tabStyle)
    },
    accessibility: {
      highContrast: Boolean(accessibility.highContrast),
      largeTargets: Boolean(accessibility.largeTargets),
      underlineLinks: Boolean(accessibility.underlineLinks),
      strongFocus: accessibility.strongFocus !== false
    },
    customCss: sanitizeCustomCss(input.customCss)
  };
}

function textureCss(texture, color) {
  if (texture === 'dots') return `radial-gradient(circle at 1px 1px, color-mix(in srgb, ${color} 18%, transparent) 1px, transparent 1.2px)`;
  if (texture === 'grid') return `linear-gradient(color-mix(in srgb, ${color} 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${color} 10%, transparent) 1px, transparent 1px)`;
  if (texture === 'paper') return `radial-gradient(circle at 20% 10%, rgba(255,255,255,.72), transparent 34%), linear-gradient(135deg, rgba(255,255,255,.42), transparent 45%)`;
  return 'none';
}

function compileTheme(themeInput) {
  const t = normalizeTheme(themeInput);
  const c = t.colors;
  const ty = t.typography;
  const l = t.layout;
  const e = t.effects;
  const a = t.accessibility;
  const tabRadius = e.tabStyle === 'pill' ? '999px' : e.tabStyle === 'soft' ? `${Math.max(8, l.panelRadius * 0.7)}px` : '4px';
  const motion = e.motion === 'none' ? '0.01ms' : e.motion === 'soft' ? '160ms' : '300ms';
  const paperTexture = textureCss(e.texture, c.ink);
  const stageTexture = textureCss(e.texture === 'paper' ? 'none' : e.texture, c.accent);
  const minimumTarget = a.largeTargets ? Math.max(48, l.navSize) : l.navSize;
  const focus = a.strongFocus ? `3px solid ${c.accent}` : `2px solid currentColor`;

  return `/* נוצר אוטומטית על ידי Jerusalem Workbook Studio. אין לערוך ידנית בתוך הבלוק. */
[data-book] {
  --ws-paper: ${c.paper};
  --ws-ink: ${c.ink};
  --ws-muted: ${c.muted};
  --ws-accent: ${c.accent};
  --ws-grade-z: ${c.gradeZ};
  --ws-grade-h: ${c.gradeH};
  --ws-grade-t: ${c.gradeT};
  color: ${c.ink};
  font-family: "${ty.bodyFont}", Arial, sans-serif;
  font-size: calc(1rem * ${ty.bodyScale});
  line-height: ${ty.lineHeight};
  font-weight: ${ty.weight};
  filter: saturate(${e.saturation}%);
}
[data-book].book-shell {
  gap: ${l.gap}px !important;
  inline-size: min(100vw - 2 * clamp(.4rem, 1vw, 1rem), ${l.shellMax}px) !important;
  margin-inline: calc((100% - min(100vw - 2 * clamp(.4rem, 1vw, 1rem), ${l.shellMax}px)) / 2) !important;
}
[data-book]:not(.is-full) .book-stage { block-size: ${l.stageHeight}vh !important; }
[data-book] .book-stage {
  background-color: ${c.stage} !important;
  background-image: ${stageTexture} !important;
  background-size: ${e.texture === 'dots' ? '18px 18px' : e.texture === 'grid' ? '24px 24px' : 'auto'} !important;
  border-radius: ${l.panelRadius}px !important;
  border: ${l.borderWidth}px solid ${c.border} !important;
  box-shadow: 0 24px 70px rgba(20, 30, 50, ${Math.min(.6, e.shadow / 100)}) !important;
  backdrop-filter: blur(${e.blur}px);
}
[data-book] .page-face {
  background-color: ${c.paper} !important;
  background-image: ${paperTexture} !important;
  background-size: ${e.texture === 'dots' ? '18px 18px' : e.texture === 'grid' ? '24px 24px' : 'cover'} !important;
  color: ${c.ink} !important;
  border-radius: ${l.pageRadius}px !important;
  padding: ${l.contentPadding}px !important;
  border: ${l.borderWidth}px solid ${c.border} !important;
  box-shadow: 0 16px 42px rgba(20, 30, 50, ${Math.min(.48, e.shadow / 120)}) !important;
}
[data-book] :is(.rashi-title,.gtoc-title,.toc-title,.item-title,.back-title,h2,h3) {
  font-family: "${ty.headingFont}", Georgia, serif !important;
  color: ${a.highContrast ? c.ink : 'inherit'};
  letter-spacing: -0.015em;
}
[data-book] :is(.rashi-title,.gtoc-title,.toc-title,.back-title) { font-size: calc(1em * ${ty.titleScale}) !important; }
[data-book] :is(p,.item-note,.item-info,.gtoc-row,.toc-row) { color: ${a.highContrast ? c.ink : c.muted}; }
[data-book] .book-bar {
  background: color-mix(in srgb, ${c.toolbar} 92%, transparent) !important;
  color: ${c.toolbarText} !important;
  border: ${l.borderWidth}px solid ${c.border} !important;
  border-radius: ${l.panelRadius}px !important;
  backdrop-filter: blur(${e.blur}px);
  box-shadow: 0 12px 34px rgba(20, 30, 50, ${Math.min(.32, e.shadow / 180)}) !important;
}
[data-book] :is(.book-tab,.book-exit,.bnav,.book-link,.book-edge,button,a) {
  transition-duration: ${motion} !important;
}
[data-book] :is(.book-tab,.book-exit,.bnav,.book-link) {
  min-block-size: ${minimumTarget}px !important;
  border-radius: ${tabRadius} !important;
  border-color: ${c.border} !important;
}
[data-book] :is(.book-tab,.bnav,.book-link) { background: ${c.toolbar} !important; color: ${c.toolbarText} !important; }
[data-book] :is(.book-tab[aria-pressed="true"],.book-tab.is-active,.bnav:hover,.book-link:hover) {
  background: ${c.accent} !important;
  color: ${c.accentText} !important;
}
[data-book] .book-exit { background: ${c.accent} !important; color: ${c.accentText} !important; }
[data-book] .book-meter { accent-color: ${c.accent} !important; }
[data-book] [data-page^="toc-z"] .page-face { --g-color: ${c.gradeZ} !important; --g-dark: color-mix(in srgb, ${c.gradeZ} 76%, black) !important; }
[data-book] [data-page^="toc-h"] .page-face { --g-color: ${c.gradeH} !important; --g-dark: color-mix(in srgb, ${c.gradeH} 76%, black) !important; }
[data-book] [data-page^="toc-t"] .page-face { --g-color: ${c.gradeT} !important; --g-dark: color-mix(in srgb, ${c.gradeT} 76%, black) !important; }
@media (min-width: 881px) {
  [data-book].is-full { --rail-w: ${l.railWidth}px !important; }
}
[data-book] :is(a,button,[tabindex]):focus-visible { outline: ${focus} !important; outline-offset: 3px !important; }
${a.underlineLinks ? '[data-book] a:not(.bnav):not(.book-tab) { text-decoration: underline !important; text-underline-offset: .2em; }' : ''}
${a.highContrast ? `[data-book] .page-face { border-color: ${c.ink} !important; }\n[data-book] :is(.book-bar,.book-tab,.bnav,.book-link) { border-color: ${c.ink} !important; }` : ''}
${e.motion === 'none' ? '[data-book] *, [data-book] *::before, [data-book] *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }' : ''}
${t.customCss}`;
}

function encodeTheme(theme) {
  return Buffer.from(JSON.stringify(theme), 'utf8').toString('base64url');
}

function decodeTheme(encoded) {
  try {
    return normalizeTheme(JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')));
  } catch {
    return normalizeTheme(DEFAULT_THEME);
  }
}

function managedBlock(theme) {
  const normalized = normalizeTheme(theme);
  return `\n\n${START_PREFIX}${encodeTheme(normalized)} -->\n<style is:global>\n${compileTheme(normalized)}\n</style>\n<!-- WORKBOOK-STUDIO:END -->\n`;
}

function readManagedTheme(source) {
  const match = source.match(START_RE);
  return {
    theme: match ? decodeTheme(match[1]) : normalizeTheme(DEFAULT_THEME),
    hasManagedBlock: Boolean(match)
  };
}

function applyManagedBlock(source, theme) {
  const block = managedBlock(theme);
  return START_RE.test(source)
    ? source.replace(START_RE, block.trim())
    : `${source.replace(/\s+$/, '')}${block}`;
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
  }));
}

function cookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || '/'}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.secure !== false) parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  return parts.join('; ');
}

function appOrigin(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET חסר או קצר מדי.');
  return crypto.createHash('sha256').update(secret).digest();
}

function seal(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64url');
}

function unseal(value) {
  try {
    const data = Buffer.from(value, 'base64url');
    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const ciphertext = data.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', sessionKey(), iv);
    decipher.setAuthTag(tag);
    const payload = JSON.parse(Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (String(payload.user?.id) !== ALLOWED_ID || String(payload.user?.login || '').toLowerCase() !== ALLOWED_LOGIN) return null;
    return payload;
  } catch {
    return null;
  }
}

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

function redirect(res, location, cookies = []) {
  res.statusCode = 302;
  res.setHeader('Location', location);
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  res.end();
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.length > 200000) throw new Error('הבקשה גדולה מדי.');
  return raw ? JSON.parse(raw) : {};
}

async function github(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Jerusalem-Workbook-Studio',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || `GitHub HTTP ${response.status}`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

function requireSession(req) {
  const cookies = parseCookies(req);
  return cookies[SESSION_COOKIE] ? unseal(cookies[SESSION_COOKIE]) : null;
}

async function getTargetFile(token) {
  const path = `/repos/${REPO}/contents/${TARGET_FILE.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(BRANCH)}`;
  const file = await github(token, path);
  if (file.type !== 'file' || !file.content) throw new Error('קובץ החוברת לא נמצא.');
  return { ...file, source: Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8') };
}

async function handleAuthStart(req, res) {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return json(res, 503, { error: 'GitHub OAuth עדיין לא הוגדר בפרויקט הניהול.' });
  }
  const state = crypto.randomBytes(24).toString('base64url');
  const callback = `${appOrigin(req)}/api?action=auth-callback`;
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: callback,
    scope: 'read:user public_repo',
    state,
    allow_signup: 'false'
  });
  redirect(res, `https://github.com/login/oauth/authorize?${params}`, [cookie(STATE_COOKIE, state, { maxAge: 600 })]);
}

async function handleAuthCallback(req, res, url) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = parseCookies(req)[STATE_COOKIE];
  if (!code || !state || !savedState || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(savedState))) {
    return json(res, 400, { error: 'אימות ההתחברות נכשל. נסה להתחבר מחדש.' });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Jerusalem-Workbook-Studio' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${appOrigin(req)}/api?action=auth-callback`
    })
  });
  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) return json(res, 401, { error: 'GitHub לא החזיר הרשאת גישה.' });

  const user = await github(tokenData.access_token, '/user');
  if (String(user.id) !== ALLOWED_ID || String(user.login || '').toLowerCase() !== ALLOWED_LOGIN) {
    return json(res, 403, { error: 'הגישה לעורך מותרת רק לחשבון GitHub של יניב.' }, {
      'Set-Cookie': cookie(STATE_COOKIE, '', { maxAge: 0 })
    });
  }

  const payload = {
    token: tokenData.access_token,
    scope: tokenData.scope || '',
    user: { id: user.id, login: user.login, name: user.name, avatar: user.avatar_url },
    exp: Date.now() + 12 * 60 * 60 * 1000
  };
  redirect(res, '/', [
    cookie(SESSION_COOKIE, seal(payload), { maxAge: 12 * 60 * 60 }),
    cookie(STATE_COOKIE, '', { maxAge: 0 })
  ]);
}

async function handlePreview(res) {
  const response = await fetch(LIVE_SITE_URL, { headers: { 'User-Agent': 'Jerusalem-Workbook-Studio-Preview' } });
  if (!response.ok) return json(res, 502, { error: 'לא ניתן לטעון כרגע את תצוגת החוברת החיה.' });
  let html = await response.text();
  const liveOrigin = new URL(LIVE_SITE_URL).origin;
  html = html.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '');
  html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${liveOrigin}/"><meta name="robots" content="noindex,nofollow">`);
  html = html.replace(/<\/body>/i, `<script>addEventListener('load',()=>setTimeout(()=>document.querySelector('[data-book]')?.scrollIntoView({block:'start'}),250));<\/script></body>`);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(html);
}

async function route(req, res) {
  const url = new URL(req.url, appOrigin(req));
  const action = url.searchParams.get('action') || 'session';

  if (action === 'auth-start') return handleAuthStart(req, res);
  if (action === 'auth-callback') return handleAuthCallback(req, res, url);

  const session = requireSession(req);
  if (action === 'session') {
    return json(res, 200, session ? {
      authenticated: true,
      user: session.user,
      repo: REPO,
      branch: BRANCH,
      targetFile: TARGET_FILE,
      liveSite: LIVE_SITE_URL
    } : { authenticated: false });
  }
  if (action === 'logout') {
    return json(res, 200, { ok: true }, { 'Set-Cookie': cookie(SESSION_COOKIE, '', { maxAge: 0 }) });
  }
  if (!session) return json(res, 401, { error: 'נדרשת התחברות מחדש.' });

  if (action === 'preview') return handlePreview(res);

  if (action === 'source') {
    const file = await getTargetFile(session.token);
    const parsed = readManagedTheme(file.source);
    const ref = await github(session.token, `/repos/${REPO}/git/ref/heads/${encodeURIComponent(BRANCH)}`);
    return json(res, 200, {
      ...parsed,
      fileSha: file.sha,
      branchCommit: ref.object?.sha,
      filePath: TARGET_FILE,
      repository: REPO,
      branch: BRANCH
    });
  }

  if (action === 'history') {
    const commits = await github(session.token, `/repos/${REPO}/commits?path=${encodeURIComponent(TARGET_FILE)}&sha=${encodeURIComponent(BRANCH)}&per_page=15`);
    return json(res, 200, {
      commits: commits.map((entry) => ({
        sha: entry.sha,
        shortSha: entry.sha.slice(0, 7),
        message: entry.commit?.message || '',
        date: entry.commit?.author?.date || null,
        author: entry.commit?.author?.name || entry.author?.login || '',
        url: entry.html_url
      }))
    });
  }

  if (action === 'save' && req.method === 'POST') {
    const body = await readJson(req);
    const theme = normalizeTheme(body.theme);
    const baseSha = String(body.baseSha || '');
    if (!baseSha) return json(res, 400, { error: 'חסרה גרסת הבסיס של הקובץ.' });

    const current = await getTargetFile(session.token);
    if (current.sha !== baseSha) {
      return json(res, 409, {
        error: 'קובץ החוברת השתנה ב-GitHub מאז שטענת אותו. השמירה נעצרה כדי לא לדרוס עבודה אחרת.',
        currentSha: current.sha
      });
    }

    const updatedSource = applyManagedBlock(current.source, theme);
    if (updatedSource === current.source) return json(res, 200, { ok: true, unchanged: true, fileSha: current.sha });

    const result = await github(session.token, `/repos/${REPO}/contents/${TARGET_FILE.split('/').map(encodeURIComponent).join('/')}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `עיצוב החוברת: ${theme.name}`,
        content: Buffer.from(updatedSource, 'utf8').toString('base64'),
        sha: current.sha,
        branch: BRANCH,
        committer: { name: session.user.name || session.user.login, email: `${session.user.id}+${session.user.login}@users.noreply.github.com` }
      })
    });

    return json(res, 200, {
      ok: true,
      fileSha: result.content?.sha,
      commitSha: result.commit?.sha,
      commitUrl: result.commit?.html_url,
      message: `העיצוב נשמר ישירות ב-${REPO}@${BRANCH}`
    });
  }

  return json(res, 404, { error: 'הפעולה אינה קיימת.' });
}

export default async function handler(req, res) {
  try {
    await route(req, res);
  } catch (error) {
    console.error(error);
    const status = Number(error.status) || 500;
    json(res, status, {
      error: status >= 500 ? 'אירעה שגיאה בשרת הניהול.' : error.message,
      details: process.env.NODE_ENV === 'development' ? error.details || error.stack : undefined
    });
  }
}
