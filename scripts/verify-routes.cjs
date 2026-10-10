const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1020}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
  const section=page.locator('#routes');await section.scrollIntoViewIfNeeded();
  for(const image of await section.locator('img').all()) await image.evaluate(img=>img.decode());
  await page.waitForFunction(()=>[...document.querySelectorAll('#routes [data-reveal]')].every(el=>getComputedStyle(el).opacity==='1'));
  assert.equal(await section.getByRole('heading',{level:2}).count(),1);
  assert.equal(await section.locator('.booking-link').getAttribute('href'),'tel:+4794791130');
  const marker = section.getByRole('button',{name:'Explore Narvik'});
  const popup = section.getByRole('dialog',{name:'Narvik',exact:true});
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  for (const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:1020});
    await marker.click();
    assert.equal(await marker.getAttribute('aria-expanded'),'true');
    await page.waitForTimeout(350);
    const canvas = await section.locator('.route-map__canvas').boundingBox();
    const point = await marker.boundingBox();
    assert(Math.abs(point.x+point.width/2-(canvas.x+canvas.width*505.9516110420227/696))<1);
    assert(Math.abs(point.y+point.height/2-(canvas.y+canvas.height*389.12341690063477/724))<1);
    const bounds = await popup.boundingBox();
    assert(bounds.x>=canvas.x && bounds.x+bounds.width<=canvas.x+canvas.width+1);
    assert(bounds.y+bounds.height<point.y+point.height/2);
    await section.screenshot({path:`.cache/verification/narvik-${width}.png`});
    await page.keyboard.press('Escape');
    assert.equal(await popup.count(),0);
    assert.equal(await marker.evaluate(el=>el===document.activeElement),true);
  }
  await marker.press('Enter');
  assert.equal(await marker.locator('span').evaluate(el=>getComputedStyle(el).animationName),'marker-pulse');
  assert.equal(await section.locator('.route-map__popup').evaluate(el=>el.getAnimations().length>0),true);
  await popup.getByRole('button',{name:'Close location details'}).click();
  assert.equal(await marker.getAttribute('aria-expanded'),'false');
  assert.equal(await section.locator('.route-map__popup').evaluate(el=>el.getAnimations().length>0),true);
  await marker.press('Enter');
  await page.waitForTimeout(400);
  assert.equal(await popup.count(),1);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  assert.equal(await section.locator('.route-map__popup').evaluate(el=>el.hidden),true);
  await marker.click();
  await section.locator('h2').click();
  assert.equal(await popup.count(),0);
  await page.setViewportSize({width:1440,height:1020});
  await section.screenshot({path:'.cache/verification/routes-desktop.png'});
  await section.locator('.booking-link').hover();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('#routes .booking-link__label')).backgroundColor==='rgb(218, 27, 27)');
  for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);}
  await page.setViewportSize({width:390,height:844});await section.screenshot({path:'.cache/verification/routes-mobile.png'});
  const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:4321/');assert.equal(await reduced.locator('#routes .routes__card').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await reduced.locator('.route-map__marker[data-stop=narvik] span').evaluate(el=>getComputedStyle(el).animationName),'none');
  await reduced.getByRole('button',{name:'Close location details'}).click(); await reduced.getByRole('button',{name:'Explore Narvik'}).click();
  assert.equal(await reduced.locator('.route-map__popup').evaluate(el=>el.getAnimations().length),0);
  await reduced.getByRole('button',{name:'Close location details'}).click();
  assert.equal(await reduced.locator('.route-map__popup').evaluate(el=>el.hidden),true);
  assert.deepEqual(errors,[]);console.log('Routes artwork loading, booking hover, headings, responsive widths and reduced motion passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

