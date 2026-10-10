const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1020 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const failures = [];
  page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  const response = await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('h1').innerText(), 'Authentic Arctic Cruise in Norway');
  await page.locator('.hero__image').evaluate((img) => img.decode());
  assert.equal(await page.locator('.hero img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)), true);
  assert.equal(await page.getByRole('link', { name: 'Book now — call Norwegian Fjord Explorer' }).count(), 2);
  const headerBooking = await page.locator('.header-booking').boundingBox();
  assert.equal(Math.abs(headerBooking.x + headerBooking.width - 1424) < 2, true, 'Header booking is aligned to the right edge');
  const out = path.resolve(__dirname, '../.cache/verification');
  fs.mkdirSync(out, { recursive: true });
  await page.screenshot({ path: path.join(out, 'hero-desktop.png'), fullPage: true });
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate((el) => el === document.activeElement), true);
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: 'About', exact: true }).click();
  assert.equal(await page.getByRole('dialog').isVisible(), true);
  assert.equal(await page.locator('#section-dialog-title').innerText(), 'About');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').isVisible(), false);

  const results = [];
  for (const width of [390, 320, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.equal(dimensions.scrollWidth <= dimensions.width, true, `Horizontal overflow at ${width}px`);
    results.push({ width, ...dimensions });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
  await toggle.click();
  assert.equal(await page.locator('#mobile-menu').isVisible(), true);
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.locator('#mobile-menu').getByRole('button', { name: 'Vessel', exact: true }).click();
  assert.equal(await page.locator('#mobile-menu').isVisible(), false);
  assert.equal(await page.locator('#section-dialog-title').innerText(), 'Vessel');
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await page.screenshot({ path: path.join(out, 'hero-mobile.png'), fullPage: true });
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ status: 'passed', viewports: results, errors, failedResponses: failures, checks: ['page response', 'semantic heading', 'all images loaded', 'booking telephone links', 'keyboard skip link', 'desktop dialog and Escape', 'responsive overflow', 'mobile menu and dialog'] }, null, 2));
  await browser.close();
  console.log('Hero browser checks passed at 320, 390, 768, 1280 and 1440px. Screenshots saved.');
})().catch((error) => { console.error(error); process.exit(1); });
