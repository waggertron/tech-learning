import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const base = process.env.POST_DISCOVERY_BASE_URL ?? 'http://127.0.0.1:4337/tech-learning';
const server = process.env.POST_DISCOVERY_BASE_URL ? null : spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4337'], { stdio: 'pipe' });
let logs = '';
server?.stdout.on('data', chunk => { logs += chunk; });
server?.stderr.on('data', chunk => { logs += chunk; });
let browser;
try {
  let response;
  for (let attempt = 0; attempt < 80; attempt++) {
    response = await fetch(`${base}/`).catch(() => null);
    if (response?.ok) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(response?.ok, `Preview unavailable: ${logs}`);
  const html = execFileSync('curl', ['--fail', '--silent', '--show-error', `${base}/`], { encoding: 'utf8' });
  assert.match(html, /Here Be Dragons/);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const region = page.locator('[data-post-browser]');
  assert.equal(await region.getAttribute('data-pagefind-ignore'), 'all', 'Search must index articles rather than hidden homepage rows.');
  const select = region.getByLabel('Sort by');
  await select.waitFor({ timeout: 5000 });
  await page.waitForFunction(() => document.querySelector('[data-post-browser]')?.getAttribute('data-ready') === 'true');
  const rows = region.locator('[data-post-date]');
  const dates = () => rows.evaluateAll(items => items.map(item => item.getAttribute('data-post-date')));
  const newest = await dates();
  assert.ok(newest.length > 10, 'Homepage must include the full post catalog for sorting.');
  assert.deepEqual(newest, [...newest].sort().reverse());
  assert.equal(await rows.nth(9).isVisible(), true);
  assert.equal(await rows.nth(10).isVisible(), false);
  const originalCount = newest.length;
  await select.selectOption('oldest');
  const oldest = await dates();
  assert.deepEqual(oldest, [...newest].sort());
  assert.equal(await rows.count(), originalCount);
  const firstLink = rows.first().locator('h3 a');
  assert.match(await firstLink.getAttribute('href'), /^posts\//);
  const screenshots = await mkdtemp(join(tmpdir(), 'tech-learning-posts-'));
  await select.selectOption('newest');
  for (const theme of ['light', 'dark']) {
    await page.evaluate(value => { document.documentElement.dataset.theme = value; localStorage.setItem('starlight-theme', value); }, theme);
    await page.screenshot({ path: join(screenshots, `home-${theme}.png`), fullPage: false });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Mobile overflow in ${theme} mode`);
    await page.screenshot({ path: join(screenshots, `home-mobile-${theme}.png`), fullPage: false });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  const fonts = await page.evaluate(() => [...document.fonts].map(font => ({ family: font.family, status: font.status })));
  assert.ok(fonts.some(font => font.family === 'Newsreader' && font.status === 'loaded'));
  assert.ok(fonts.some(font => font.family === 'Source Sans 3' && font.status === 'loaded'));
  await page.goto(`${base}/posts/`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('heading', { name: 'Posts', level: 1 }).isVisible(), true);
  assert.equal(await page.locator('article.preview').count(), 10);
  assert.ok(await page.locator('article.preview time').count() >= 10);
  const archiveDates = await page.locator('article.preview time').evaluateAll(items => items.map(item => ({ value: item.dateTime, label: item.textContent.trim() })));
  for (const date of archiveDates) {
    assert.equal(date.label, new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date.value)), 'Archive dates must preserve the publication day.');
  }
  assert.ok((await page.locator('article.preview').first().innerText()).length < 1500, 'Archive should use concise excerpts.');
  await page.goto(`${base}/posts/2/`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('heading', { name: 'Posts', level: 1 }).isVisible(), true);
  assert.ok(await page.locator('article.preview').count() > 0);
  for (const route of ['/posts/tags/system-design/', '/posts/series/', '/posts/series/domain-specific-languages/', '/posts/2026-11-09-atomic-callback-claims-and-safe-retries/']) {
    const result = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
    assert.equal(result.status(), 200, route);
    assert.ok((await page.locator('h1').innerText()).length > 0);
  }
  const feed = await fetch(`${base}/posts/rss.xml`);
  assert.equal(feed.status, 200);
  assert.match(await feed.text(), /<rss/);
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/`);
  assert.equal(await staticPage.locator('[data-post-date]').count(), originalCount);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log(`Post discovery passed: ${originalCount} posts, newest/oldest sorting, archive pagination, tags, RSS, preserved series/post URLs, fonts, mobile overflow, both themes, and no-JavaScript links. Screenshots: ${screenshots}`);
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await once(server, 'exit');
  }
}
