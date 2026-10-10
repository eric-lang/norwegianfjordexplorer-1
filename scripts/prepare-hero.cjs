const fs = require('node:fs');
const path = require('node:path');
const sharp = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const root = path.resolve(__dirname, '..');
const data = require('../design-inspection/decoded.json');
const paths = require('../design-inspection/geometry-paths.json');
const assets = require('../design-inspection/assets.json');

(async () => {
  const out = path.join(root, 'public/images');
  fs.mkdirSync(out, { recursive: true });
  const photo = assets.find((asset) => asset.hash === 'bc883ee29467113b1834af7ea2fec329968da18d');
  // The exported paint transform maps the frame into image UV coordinates.
  // Bake the visible 1440 × 1020 region into an appropriately cropped image.
  const node = data.nodeChanges.find((node) => node.guid.sessionID === 1 && node.guid.localID === 4);
  const paint = node.fillPaints.find((paint) => paint.type === 'IMAGE');
  const image = sharp(path.join(root, 'design-inspection', photo.file));
  const metadata = await image.metadata();
  const t = paint.transform;
  const left = Math.round(t.m02 * metadata.width);
  const top = Math.round(t.m12 * metadata.height);
  const width = Math.min(metadata.width - left, Math.round(t.m00 * metadata.width));
  const height = Math.min(metadata.height - top, Math.round(t.m11 * 1020 / node.size.y * metadata.height));
  await image.extract({ left, top, width, height }).webp({ quality: 92 }).toFile(path.join(out, 'arctic-fjord.webp'));

  const logo = assets.find((asset) => asset.hash === 'f9bc90d010a0c5c0184e5e4d029bd2b94f2d4c67');
  fs.copyFileSync(path.join(root, 'design-inspection', logo.file), path.join(out, 'explorer-logo.png'));

  const heading = data.nodeChanges.find((node) => node.guid.sessionID === 1 && node.guid.localID === 42);
  const glyphs = heading.derivedTextData.glyphs.map((glyph) => {
    const d = paths[glyph.commandsBlob].replace(/^Z\s*/, '');
    return `<path d="${d}" transform="translate(${glyph.position.x} ${glyph.position.y}) rotate(${glyph.rotation || 0}) scale(${glyph.fontSize} ${-glyph.fontSize})"/>`;
  }).join('');
  fs.writeFileSync(path.join(out, 'hero-heading.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="713" height="210" viewBox="0 0 713 210" fill="#fff">${glyphs}</svg>`);
  console.log(`Hero image: ${width} × ${height}. Original logo and heading outlines exported.`);
})().catch((error) => { console.error(error); process.exit(1); });
