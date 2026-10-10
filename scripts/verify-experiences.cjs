const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1020 } });
    const errors = [], failedResponses = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });
    await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.getAnimations().filter((a) => ['hero-enter', 'nav-item-enter'].includes(a.animationName)).every((a) => a.playState === 'finished'));
    const out = path.resolve(__dirname, '../.cache/verification');
    fs.mkdirSync(out, { recursive: true });
    assert.equal(await page.locator('.hero__heading-line').count(), 2);
    assert.equal(await page.locator('.hero__heading-line').first().evaluate((el) => getComputedStyle(el).animationName), 'hero-enter');
    await page.locator('.hero').screenshot({ path: path.join(out, 'hero-desktop.png') });

    async function hoverColor(selector, background, foreground) {
      await page.locator(selector).hover();
      await page.waitForFunction(({ selector, background, foreground }) => {
        const link = document.querySelector(selector);
        return getComputedStyle(link.querySelector('.booking-link__label')).backgroundColor === background && getComputedStyle(link).color === foreground;
      }, { selector, background, foreground });
    }
    await hoverColor('.header-booking .booking-link', 'rgb(218, 27, 27)', 'rgb(255, 250, 231)');
    await hoverColor('.hero__destinations > .booking-link', 'rgb(255, 250, 231)', 'rgb(27, 54, 97)');

    const section = page.locator('#experiences');
    await page.locator('.desktop-nav').getByRole('link', { name: 'Experiences', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#experiences .experiences__header').classList.contains('is-revealed'));
    assert.equal(await page.getByRole('tab').count(), 4);
    const firstTitles = [];
    for (const label of ['Tromsø', 'Lofoten & Vesterålen', 'Special Cruises', 'Charter']) {
      const tab = page.getByRole('tab', { name: label, exact: true });
      await tab.click();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('[role="tab"][aria-selected="true"]')).backgroundColor === 'rgb(228, 216, 172)');
      assert.equal(await tab.getAttribute('aria-selected'), 'true');
      assert.equal(await page.getByRole('tabpanel').count(), 1);
      assert.equal(await page.getByRole('tabpanel').locator('.experience-card').count(), 6);
      firstTitles.push(await page.getByRole('tabpanel').locator('h3').first().innerText());
    }
    assert.equal(new Set(firstTitles).size, 4);
    assert.equal(await page.getByRole('tabpanel').getByText('Request a quote', { exact: false }).count(), 6);
    await page.getByRole('tab', { name: 'Charter', exact: true }).press('Home');
    assert.equal(await page.getByRole('tab', { name: 'Tromsø', exact: true }).getAttribute('aria-selected'), 'true');
    await page.getByRole('tab', { name: 'Tromsø', exact: true }).press('ArrowRight');
    assert.equal(await page.getByRole('tab', { name: 'Lofoten & Vesterålen', exact: true }).getAttribute('aria-selected'), 'true');
    await page.getByRole('tab', { name: 'Lofoten & Vesterålen', exact: true }).press('End');
    assert.equal(await page.getByRole('tab', { name: 'Charter', exact: true }).getAttribute('aria-selected'), 'true');
    await page.getByRole('tab', { name: 'Tromsø', exact: true }).click();
    const cards = page.getByRole('tabpanel').locator('.experience-card');
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await card.locator('img').evaluate((img) => img.decode());
    }
    await cards.first().hover();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#panel-tromso .experience-card')).backgroundColor === 'rgb(255, 253, 247)');
    await page.waitForFunction(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#panel-tromso .experience-card img')).transform).a < 1.01);
    assert.equal(await cards.locator('.experience-card__caption').count(), 6);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#panel-tromso .experience-card__caption')).opacity === '1');
    assert.equal(await cards.first().evaluate((el) => getComputedStyle(el).color), 'rgb(12, 29, 55)');
    await cards.first().screenshot({ path: path.join(out, 'card-hover.png') });
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => [...document.querySelectorAll('#panel-tromso [data-reveal]')].every((el) => getComputedStyle(el).opacity === '1'));
    assert.equal(await page.locator('.skip-link').evaluate((el) => getComputedStyle(el).opacity), '0');
    await section.screenshot({ path: path.join(out, 'experiences-desktop.png') });

    const viewports = [];
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      const size = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      assert.equal(size.scrollWidth <= size.width, true, `Horizontal overflow at ${width}px`);
      viewports.push(size);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('tab', { name: 'Charter', exact: true }).click();
    assert.equal(await page.getByRole('tabpanel').getAttribute('id'), 'panel-charter');
    await page.getByRole('tab', { name: 'Tromsø', exact: true }).click();
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await page.mouse.move(0, 0);
    await section.screenshot({ path: path.join(out, 'experiences-mobile.png') });
    await page.locator('.hero').scrollIntoViewIfNeeded();
    await page.locator('.hero').screenshot({ path: path.join(out, 'hero-mobile.png') });
    await page.locator('.menu-toggle').click();
    await page.waitForFunction(() => document.getAnimations().filter((a) => ['menu-open', 'menu-item-enter'].includes(a.animationName)).every((a) => a.playState === 'finished'));
    const menuBox = await page.locator('.mobile-nav').boundingBox();
    assert(menuBox.width < 390 && menuBox.height < 844);
    await page.locator('.hero').screenshot({ path: path.join(out, 'navigation-mobile.png') });
    await page.locator('.menu-toggle').click();
    await page.locator('.hero__destinations').getByRole('link', { name: 'Lofoten & Vesterålen', exact: true }).click();
    assert.equal(await page.getByRole('tab', { name: 'Lofoten & Vesterålen', exact: true }).getAttribute('aria-selected'), 'true');

    const reduced = await browser.newPage({ reducedMotion: 'reduce' });
    await reduced.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    assert.equal(await reduced.locator('.hero__heading-line').first().evaluate((el) => getComputedStyle(el).animationName), 'none');
    assert.equal(await reduced.locator('#experiences .experience-card').first().evaluate((el) => getComputedStyle(el).opacity), '1');
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    assert.equal(await noJS.locator('#panel-tromso .experience-card').first().evaluate((el) => getComputedStyle(el).opacity), '1');
    assert.deepEqual(errors, []);
    assert.deepEqual(failedResponses, []);
    fs.writeFileSync(path.join(out, 'experience-results.json'), JSON.stringify({ status: 'passed', firstTitles, viewports, errors, failedResponses, checks: ['opposite CTA hover colors', 'staggered hero animation', 'four tabs and six cards each', 'keyboard tab selection', 'charter quotes', 'card image zoom out and pale cream background', 'responsive overflow', 'hero links select tabs', 'reduced motion', 'no-JS content visible'] }, null, 2));
    console.log('Experience tabs, hover states, animation, keyboard access and responsive checks passed.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });

