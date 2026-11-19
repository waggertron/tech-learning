import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright';

const base = process.env.CONTENT_TAGS_BASE_URL ?? 'http://127.0.0.1:4345/tech-learning';
const server = process.env.CONTENT_TAGS_BASE_URL ? null : spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4345'], { stdio: 'pipe' });
let logs = '';
server?.stdout.on('data', chunk => { logs += chunk; });
server?.stderr.on('data', chunk => { logs += chunk; });
let browser;
try {
  let response;
  for (let attempt = 0; attempt < 80; attempt++) {
    response = await fetch(`${base}/tags/`).catch(() => null);
    if (response?.ok) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(response?.ok, `Tag directory HTTP check failed: ${logs}`);
  const html = execFileSync('curl', ['--fail', '--silent', '--show-error', `${base}/tags/`], { encoding: 'utf8' });
  assert.match(html, /data-tag-directory/, 'Tag directory must be present before browser checks');

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/topics/system-design/case-studies/patient-lookup-aws/`, { waitUntil: 'domcontentloaded' });
  const topicTags = page.getByRole('navigation', { name: 'Page tags', exact: true });
  await topicTags.getByRole('link', { name: 'aws', exact: true }).click();
  await page.waitForURL('**/posts/tags/aws/');
  assert.equal(await page.locator('[data-tag-archive="aws"]').count(), 1, 'Existing tag URL must use the unified archive');
  assert.equal(await page.locator('[data-tag-entry="topics/system-design/case-studies/patient-lookup-aws"]').count(), 1);

  await page.goto(`${base}/posts/2026-11-09-atomic-callback-claims-and-safe-retries/`, { waitUntil: 'domcontentloaded' });
  await page.locator('.post-footer').getByRole('link', { name: 'system-design', exact: true }).click();
  await page.waitForURL('**/posts/tags/system-design/');
  assert.equal(await page.locator('[data-tag-entry="posts/2026-11-09-atomic-callback-claims-and-safe-retries"]').count(), 1);
  assert.equal(await page.locator('[data-tag-entry="topics/system-design/case-studies/patient-lookup-aws"]').count(), 1, 'Blog tag archive must also include topics');
  await page.getByRole('link', { name: 'Browse all tags', exact: true }).click();
  await page.waitForURL('**/tags/');
  assert.equal(await page.locator('[data-tag-directory]').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Tag directory must fit mobile width');
  await context.close();
  console.log('Unified tag browser validation passed: HTTP/curl, topic and post tag clicks, shared membership, preserved tag URLs, directory, mobile width, and no-JavaScript navigation.');
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await once(server, 'exit');
  }
}
