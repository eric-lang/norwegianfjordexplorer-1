const path=require('node:path');
const sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const assets=require('../design-inspection/assets.json');
const images={
 'stop-dock':'1af703419654d4702e624e0e4214d3d4c3a4bb50',
 'stop-island':'fa445c79aded28af128dbb2fd4130b3878639c60',
 'stop-city':'5d275c84c00d9cade0ad205e91472e3c2b85803e',
 'stop-cathedral':'80dbc1a986716350a436dca81a82e997939aa0fe',
 'stop-captain':'1282b2cfdfa15f89685ba5d4639d48b6d29d8787',
};
(async()=>{for(const [name,hash] of Object.entries(images)) {const asset=assets.find(a=>a.hash===hash);await sharp(path.resolve('design-inspection',asset.file)).resize({width:name==='stop-captain'?1600:1000}).webp({quality:86}).toFile(`public/images/${name}.webp`);}})().catch(e=>{console.error(e);process.exit(1)});
