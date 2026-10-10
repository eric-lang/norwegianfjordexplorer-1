const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {chromium} = require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1020}});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
  const boat=page.locator('#vessel'); const tabs=boat.getByRole('tab');
  assert.equal(await tabs.count(),4);
  const copies=[]; const images=[];
  for(let i=0;i<4;i++) {await tabs.nth(i).click(); assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true'); images.push(await boat.getByRole('tabpanel').locator('img').getAttribute('src')); copies.push(await boat.locator('[data-boat-copy]:visible').innerText());}
  assert.equal(new Set(images).size,4); assert.equal(new Set(copies).size,4);
  await tabs.nth(3).press('Home'); assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');
  await page.evaluate(()=>{const el=document.querySelector('.boat__runway'); window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top+20)});
  await page.waitForTimeout(1000);
  const stage=await boat.locator('.boat__stage').boundingBox(); await page.mouse.move(stage.x+stage.width/2,stage.y+stage.height/2);
  await page.mouse.wheel(0,100); await page.waitForTimeout(1000); assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
  await page.mouse.wheel(0,-100); await page.waitForTimeout(1000); assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');
  const before=await page.evaluate(()=>scrollY); await page.mouse.wheel(0,-150); await page.waitForTimeout(400); assert((await page.evaluate(()=>scrollY))<before);
  await boat.getByRole('tabpanel').locator('img').evaluate(img=>img.decode());
  fs.mkdirSync('.cache/verification',{recursive:true}); await boat.screenshot({path:'.cache/verification/boat-desktop.png'});
  await page.evaluate(()=> {document.documentElement.style.scrollBehavior='auto';const el=document.querySelector('.boat__runway');window.scrollTo(0,scrollY+el.getBoundingClientRect().top+200);});
  const pinned = await boat.locator('.boat__eyebrow').boundingBox();
  assert(Math.abs(pinned.y)<2, `Service Offerings sticky top: ${pinned.y}`);
  await page.evaluate(()=>window.scrollBy(0,150));
  assert(Math.abs((await boat.locator('.boat__eyebrow').boundingBox()).y)<2);
  await page.setViewportSize({width:1280,height:600}); await page.evaluate(()=>{const el=document.querySelector('.boat__runway');window.scrollTo(0,scrollY+el.getBoundingClientRect().top+100)}); assert(Math.abs((await boat.locator('.boat__eyebrow').boundingBox()).y)<2, 'Pins in a short desktop preview');
  for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:844}); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.setViewportSize({width:390,height:844}); await tabs.nth(2).click(); await page.waitForTimeout(1200); await boat.screenshot({path:'.cache/verification/boat-mobile.png'});
  const reduced=await browser.newPage({reducedMotion:'reduce'}); await reduced.goto('http://127.0.0.1:4321/'); await reduced.locator('#boat-tab-1').click(); assert.equal(await reduced.locator('#vessel').evaluate(el=>el.getAnimations({subtree:true}).length),0);
  assert.deepEqual(errors,[]); console.log('Boat click, keyboard, wheel direction, scroll exit, distinct content, reduced motion and responsive checks passed.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});


