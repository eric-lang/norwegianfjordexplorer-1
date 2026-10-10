const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync('design-inspection/parser/preview.cjs', 'utf8').split('const dir=')[0];
const {createRequire} = require('node:module');
vm.runInNewContext(source + `
const node = d.nodeChanges.find(n => id(n.guid) === '1:273');
// Keep the route artwork transparent; the card provides the red background.
const mask = d.nodeChanges.find(n => id(n.guid) === '1:276');
mask.fillPaints = [];
node.fillPaints = [];
const backdrop = d.nodeChanges.find(n => id(n.guid) === '1:280');
backdrop.fillPaints = [];
const body = render(node, true, true);
fs.writeFileSync(path.resolve(__dirname, '../../public/images/routes-map.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 696 724"><defs>'+defs.join('')+'</defs>'+body+'</svg>');
`, {require:createRequire(path.resolve('design-inspection/parser/preview.cjs')), __dirname:path.resolve('design-inspection/parser'), Buffer});
