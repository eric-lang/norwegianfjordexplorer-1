const path=require('node:path');const assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1020}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.route-map__selector select').evaluate(el=>getComputedStyle(el).paddingRight),'28px');
 const section=page.locator('#stops');const cards=section.locator('.stop-card');assert.equal(await cards.count(),5);
 for(const card of await cards.all()){await card.scrollIntoViewIfNeeded();await card.locator('img').evaluate(img=>img.decode());}
 assert.equal(await cards.first().evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');
 assert.equal(await cards.first().locator('.stop-card__label').first().evaluate(el=>getComputedStyle(el).color),'rgb(218, 27, 27)');
 await page.waitForTimeout(800);await section.screenshot({path:'.cache/verification/stops-desktop.png'});
 for(let i=0;i<5;i++){
  const card=cards.nth(i);await card.locator('.stop-card__trigger').click();await page.waitForTimeout(850);
  assert.equal(await card.locator('.stop-card__trigger').getAttribute('aria-expanded'),'true');assert.equal(await cards.filter({has:page.locator('[aria-expanded="true"]')}).count(),1);
  assert.equal(await card.getByRole('region').count(),1);assert.equal(await card.locator('.stop-card__caption').evaluate(el=>getComputedStyle(el.querySelector('.stop-card__title')).fontSize==='24px'),true);
  const ratio=await card.evaluate(el=>el.querySelector('.stop-card__trigger').getBoundingClientRect().width/el.getBoundingClientRect().width);assert(ratio<.4);
 }
 await cards.nth(4).locator('.stop-card__close').click();await page.waitForTimeout(400);assert.equal(await cards.nth(4).getByRole('region').count(),0);
 await cards.first().locator('.stop-card__trigger').press('Enter');await page.waitForTimeout(850);await cards.first().screenshot({path:'.cache/verification/stops-dock-open.png'});
 assert.equal(await cards.first().locator('h3').evaluate(el=>getComputedStyle(el).fontSize),'40px');
 assert.equal(await cards.first().locator('.stop-card__detail .stop-card__label').evaluate(el=>getComputedStyle(el).fontSize),'14px');
 await page.keyboard.press('Escape');assert.equal(await cards.first().locator('.stop-card__trigger').evaluate(el=>el===document.activeElement),true);
 await page.waitForTimeout(650);
 await cards.first().locator('.stop-card__trigger').click();
 const position=await cards.first().locator('h3').boundingBox();
 await page.waitForTimeout(150);
 const during=await cards.first().locator('h3').boundingBox();
 assert.equal(Math.round(position.x),Math.round(during.x));
 assert.equal(Math.round(position.y),Math.round(during.y));
 assert.equal(await cards.first().locator('.stop-card__detail').evaluate(el=>getComputedStyle(el).transform),'none');
 await page.evaluate(()=>document.querySelector('.stops__header').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})));
 await page.waitForTimeout(80);
 await cards.first().locator('.stop-card__trigger').evaluate(el=>el.click());
 await page.waitForTimeout(650);
 assert.equal(await cards.first().locator('.stop-card__detail').evaluate(el=>el.hidden),false);
 await page.evaluate(()=>document.querySelector('.stops__header').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})));
 await page.waitForTimeout(650);
 assert.equal(await cards.first().locator('.stop-card__detail').evaluate(el=>el.hidden),true);
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.setViewportSize({width:390,height:844});await cards.first().locator('.stop-card__trigger').click();await page.waitForTimeout(850);await cards.first().screenshot({path:'.cache/verification/stops-mobile-open.png'});
 const detail=await cards.first().locator('.stop-card__detail').boundingBox();const card=await cards.first().boundingBox();assert(detail.x>=card.x&&detail.x+detail.width<=card.x+card.width+1);
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:4321/');await reduced.locator('.stop-card__trigger').first().click();assert.equal(await reduced.locator('.stop-card__detail').first().evaluate(el=>el.getAnimations().length),0);await reduced.locator('.stop-card__close').first().click();assert.equal(await reduced.locator('.stop-card__detail').first().evaluate(el=>el.hidden),true);
 assert.deepEqual(errors,[]);console.log('Five stop panels, shrink and slide motion, single selection, close and keyboard controls, image loading, selector padding, responsive widths and reduced motion passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
