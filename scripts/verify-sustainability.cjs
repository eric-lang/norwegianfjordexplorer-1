const path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
const page=await browser.newPage({viewport:{width:1440,height:1020}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4321/#sustainability',{waitUntil:'networkidle'});
const section=page.locator('#sustainability'),video=section.locator('video'),play=section.getByRole('button',{name:'Play the Lofoten fjord film'});
await section.scrollIntoViewIfNeeded();await page.waitForTimeout(900);
assert.equal(await video.evaluate(v=>v.paused),true);assert.equal(await video.getAttribute('preload'),'none');
assert.equal(await section.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 250, 231)');
await section.screenshot({path:'.cache/verification/sustainability-desktop.png'});
await play.click();await page.waitForFunction(()=>{const v=document.querySelector('.sustainability video');return v.readyState>=2&&!v.paused&&v.currentTime>0;},null,{timeout:30000});
assert.equal(await video.evaluate(v=>v.controls),true);assert.equal(await play.count(),0);
await video.evaluate(v=>v.pause());assert.equal(await video.evaluate(v=>v.paused),true);
await video.evaluate(v=>v.dispatchEvent(new Event('ended')));assert.equal(await play.count(),1);
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
await page.setViewportSize({width:390,height:844});await section.screenshot({path:'.cache/verification/sustainability-mobile.png'});
assert.deepEqual(errors,[]);console.log('Video decoding and playback, controls, pause and replay, poster, colors, and four responsive widths passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
