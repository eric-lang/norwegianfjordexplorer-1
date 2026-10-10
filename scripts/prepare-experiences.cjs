const fs = require('node:fs');
const path = require('node:path');
const sharp = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const assets = require('../design-inspection/assets.json');
const data = require('../design-inspection/decoded.json');
const paths = require('../design-inspection/geometry-paths.json');
const root = path.resolve(__dirname, '..');

const images = {
  'fjord-breakfast': 'a6cd68627a05e0937281600e65000048c48041d4',
  'onboard-breakfast': '315debe625dcb885e70d868b7e882c2f38a837e1',
  'ship-at-night': 'eac439d54630e66e6bde495e81f009d0a878809c',
  'island-cruise': 'dc1db735868536c5db5d4488da7da4b0d463573f',
  'tromso-evening': '92df4649ab2e8529b28e560f0eea86a23a4c71b5',
  'explorer-ship': 'ee7580adb7ccd26b12319716d8f4a8a9fd08ea40',
};

function glyphPaths(node, yOffset = 0, filter = () => true) {
  return node.derivedTextData.glyphs.filter(filter).map((glyph) => `<path d="${paths[glyph.commandsBlob].replace(/^Z\s*/, '')}" transform="translate(${glyph.position.x} ${glyph.position.y - yOffset}) scale(${glyph.fontSize} ${-glyph.fontSize})"/>`).join('');
}

(async () => {
  const out = path.join(root, 'public/images');
  for (const [name, hash] of Object.entries(images)) {
    const asset = assets.find((asset) => asset.hash === hash);
    if (!asset) throw new Error(`Missing asset ${name}`);
    await sharp(path.join(root, 'design-inspection', asset.file)).resize(960, 754, { fit: 'cover' }).webp({ quality: 85 }).toFile(path.join(out, name + '.webp'));
  }
  const heading = data.nodeChanges.find((node) => node.guid.sessionID === 1 && node.guid.localID === 67);
  fs.writeFileSync(path.join(out, 'experiences-heading.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="724" height="65" viewBox="0 0 724 65" fill="#1e1e1e">${glyphPaths(heading)}</svg>`);
  const hero = data.nodeChanges.find((node) => node.guid.sessionID === 1 && node.guid.localID === 42);
  for (let line = 0; line < 2; line++) {
    const offset = line * 105;
    fs.writeFileSync(path.join(out, `hero-heading-line-${line + 1}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="713" height="105" viewBox="0 0 713 105" fill="#fff">${glyphPaths(hero, offset, (glyph) => glyph.position.y >= offset && glyph.position.y < offset + 105)}</svg>`);
  }
  console.log('Prepared six experience photographs, section heading and two hero heading lines.');
})().catch((error) => { console.error(error); process.exit(1); });
