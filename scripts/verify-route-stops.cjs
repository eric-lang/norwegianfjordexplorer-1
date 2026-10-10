const path = require('node:path');
const assert = require('node:assert/strict');
const {routeStops} = require('../src/data/route-stops.ts');
const {chromium} = require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1020},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
  const map=page.locator('.routes__map'); const popup=map.getByRole('dialog');
  assert.equal(await popup.getByRole('heading').innerText(),'Narvik');
  assert.equal(await page.locator('.route-map__marker[aria-expanded="true"]').count(),1);
  assert.equal(await map.getByRole('combobox').locator('option').count(),24);
  assert.equal(await map.locator('.route-map__marker').count(),19);
  for(const width of [1440,768,390,320]) {
   await page.setViewportSize({width,height:1020});
   for(const stop of routeStops) {
    await map.getByRole('combobox').selectOption(stop.id);
    assert.equal(await popup.getByRole('heading').innerText(),stop.name);
    assert.equal(await popup.locator('[data-stop-story]').innerText(),stop.story);
    assert.equal(await popup.locator('[data-stop-source]').getAttribute('href'),stop.source);
    assert.equal(await page.locator('.route-map__marker[aria-expanded="true"]').count(),1);
    const canvas=await map.locator('.route-map__canvas').boundingBox();const bounds=await popup.boundingBox();
    assert(bounds.x>=canvas.x-1 && bounds.x+bounds.width<=canvas.x+canvas.width+1,`Popup overflow: ${stop.name} at ${width}`);
   }
   const canvas=await map.locator('.route-map__canvas').boundingBox();
   for(const marker of await map.locator('.route-map__marker').all()) {
    const id=await marker.getAttribute('data-stop');
    const stop=routeStops.find(s=>s.id===id);
    const point=await marker.boundingBox();
    assert(Math.abs(point.x+point.width/2-(canvas.x+canvas.width*stop.point[0]/696))<1);
    assert(Math.abs(point.y+point.height/2-(canvas.y+canvas.height*stop.point[1]/724))<1);
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await map.getByRole('combobox').selectOption('narvik');
  await popup.getByRole('button',{name:'Explore nearby: Harstad →'}).click();
  assert.equal(await popup.getByRole('heading').innerText(),'Harstad');
  await page.keyboard.press('Escape');assert.equal(await popup.count(),0);
  assert.equal(await map.locator('[data-stop="harstad"]').evaluate(el=>el===document.activeElement),true);
  await map.locator('[data-stop="harstad"]').press('Enter');assert.equal(await popup.getByRole('heading').innerText(),'Harstad');
  await popup.getByRole('button',{name:'Close location details'}).click();assert.equal(await popup.count(),0);
  await map.getByRole('combobox').selectOption('narvik');
  await page.setViewportSize({width:1440,height:1020});await page.locator('#routes').screenshot({path:'.cache/verification/all-stops-desktop.png'});
  await page.setViewportSize({width:390,height:1020});await page.locator('#routes').screenshot({path:'.cache/verification/all-stops-mobile.png'});
  const animated=await browser.newPage({viewport:{width:1440,height:1020}});await animated.goto('http://127.0.0.1:4321/');
  await animated.getByRole('button',{name:'Close location details'}).click();await animated.waitForTimeout(250);
  await animated.locator('.route-map__marker[data-stop="skjervoy"]').click();
  assert.equal(await animated.getByRole('dialog').getByRole('heading').innerText(),'Skjervøy');
  await animated.getByRole('button',{name:'Close location details'}).click();
  await animated.locator('.route-map__marker[data-stop="skjervoy"]').press('Enter');await animated.waitForTimeout(400);
  assert.equal(await animated.getByRole('dialog').count(),1);
  const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto('http://127.0.0.1:4321/');assert.equal(await noJS.getByRole('dialog').getByRole('heading').innerText(),'Narvik');
  assert.deepEqual(errors,[]);console.log('24 destination stories, 19 mapped anchors, default-open Narvik, nearby links, resizing, keyboard, animation interruption and no-JS checks passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
