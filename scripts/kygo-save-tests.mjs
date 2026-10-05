// Dependency-free tests execute the shipped save functions, including the import boundary.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../kygo-world/index.html', import.meta.url), 'utf8');
function declaration(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `missing ${name}`);
  const end = html.indexOf('\nfunction ', start + 1);
  // These declarations are followed by a new declaration or by DOM bindings.
  const binding = html.indexOf("\n$('#", start + 1);
  return html.slice(start, Math.min(...[end, binding].filter(n => n >= 0)));
}
const defaults = html.match(/const defaults=\(\)=>\([\s\S]*?\);let saved;/)[0].replace(';let saved;', ';');
let stored = '{"level":42,"coins":123}', writes = 0, confirms = 0, reloads = 0, lastStatus;
const sandbox = {
  MAX_LEVEL:100, storeKey:'test', TextDecoder, TextEncoder,
  atob:s=>Buffer.from(s,'base64').toString('binary'),
  status:s=>lastStatus=s, t:s=>s, confirm:()=>{confirms++;return true},
  location:{reload:()=>reloads++},
  localStorage:{setItem:(_key,value)=>{stored=value;writes++}}
};
vm.createContext(sandbox);
vm.runInContext(defaults + '\n' + ['validCourse','normalizeSave','validGhost','b64dec','restoreFrom'].map(declaration).join('\n'), sandbox);
const normalize = (value, strict=true) => sandbox.normalizeSave(value,strict);
let checks = 0;
function check(fn) {fn();checks++;}
const objects = ['best','stars','bestTrial','editionLevels','editionCompleted','dogRewards','stats','settings','ui','ghosts'];
const invalid = objects.flatMap(key => [null,[],false,'wrong'].map(value=>({coins:0,level:1,[key]:value})));
invalid.push(...[
  {editionCompleted:{classic:[null]}}, {editionCompleted:{easter:[101]}},
  {editionLevels:{classic:1.5}}, {dogRewards:{biscuits:-1}}, {stats:{runs:null}},
  {settings:{speed:'65'}}, {ui:{motion:'false'}}, {stars:{'classic-1':4}},
  {best:{dash:null}}, {bestTrial:{x:Infinity}}, {ghosts:{dash:{ev:null}}},
  {customCourse:[null]}, {customCourse:[{x:'5',y:3,type:'paw'}]},
  {customCourse:[{x:true,y:3,type:'paw'}]}, {customCourse:[{x:5,y:'3',type:'paw'}]}
].map(fields=>({coins:0,level:1,...fields})));
for (const data of invalid) {
  check(()=>assert.throws(()=>normalize(data)));
  const recovered=normalize(data,false);
  check(()=>assert.ok(objects.every(key=>recovered[key]!==null&&typeof recovered[key]==='object'&&!Array.isArray(recovered[key]))));
}
for (const data of [...invalid.filter(v=>!v.bestTrial?.x),{coins:0,level:1,app:null},{coins:0,level:1,app:''}]) {
  for (const input of [JSON.stringify(data),'KYGO1:'+Buffer.from(JSON.stringify(data)).toString('base64')]) {
    const before={stored,writes,confirms,reloads};
    sandbox.restoreFrom(input);
    check(()=>assert.deepEqual({stored,writes,confirms,reloads},before));
    check(()=>assert.equal(lastStatus,'saveInvalid'));
  }
}
const legacy=normalize({coins:7,level:9,edition:'easter',editionLevels:{classic:3}});
check(()=>assert.equal(legacy.level,9));
check(()=>assert.equal(legacy.editionLevels.classic,3));
check(()=>assert.ok(Array.isArray(legacy.editionCompleted.easter)));
check(()=>assert.equal(legacy.settings.speed,65));
check(()=>assert.equal(normalize({coins:0,level:9,editionLevels:{classic:1}}).level,1));
check(()=>assert.equal(normalize({coins:0,level:9}).level,9));
check(()=>assert.equal(normalize({coins:0,level:1,customCourse:[{x:5,y:3,type:'paw'}]}).customCourse.length,1));
const backup=JSON.stringify(legacy);
for(const input of [backup,'KYGO1:'+Buffer.from(backup).toString('base64')]) {
  sandbox.restoreFrom(input);
  check(()=>assert.equal(JSON.parse(stored).level,9));
}
check(()=>assert.equal(writes,2));
check(()=>assert.equal(confirms,2));
check(()=>assert.equal(reloads,2));
console.log(`PASS ${checks} Kygo save assertions`);
