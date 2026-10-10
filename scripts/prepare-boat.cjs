const fs = require('node:fs');
const path = require('node:path');
const sharp = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const assets = require('../design-inspection/assets.json');
const data = require('../design-inspection/decoded.json');
const paths = require('../design-inspection/geometry-paths.json');
(async () => {
  const asset = assets.find(a => a.hash === 'a1bb2eff8b1e782d0dfd02c9d60c5011c8b9f9bf');
  await sharp(path.resolve('design-inspection', asset.file)).resize({width:1200}).webp({quality:87}).toFile('public/images/boat-bistro.webp');
  const n = data.nodeChanges.find(n => n.guid.sessionID === 1 && n.guid.localID === 232);
  const glyphs = n.derivedTextData.glyphs.map(g => `<path d="${paths[g.commandsBlob].replace(/^Z\s*/, '')}" transform="translate(${g.position.x} ${g.position.y}) scale(${g.fontSize} ${-g.fontSize})"/>`).join('');
  fs.writeFileSync('public/images/boat-heading.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444 132" fill="#1e1e1e">${glyphs}</svg>`);
})();
