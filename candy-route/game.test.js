import { LEVELS,freshState,validateState,unlocked,award,dailyStreet,localDay,parseShared,shareHash,migrateV1 } from './game.js';
import { bestRoute } from './candy.js';
const clone=s=>JSON.parse(JSON.stringify(s));
describe('Campaign and progress',()=>{
 test('30 progressively unlocked levels with valid optimal routes',()=>{
  const s=freshState();expect(LEVELS).toHaveLength(30);expect(unlocked(s.progress,2)).toBe(false);
  for(const l of LEVELS){expect(unlocked(s.progress,l.id)).toBe(true);s.attempt={kind:'campaign',level:l.id,day:'',street:[...l.street],mode:l.mode,picked:bestRoute(l.street,l.mode==='circle').indices,hinted:false,revealed:false,credited:false};award(s);expect(validateState(s).progress[l.id].stars).toBe(3);}
  expect(s.wins).toBe(30);
 });
 test('hints get two stars; revealing is practice; replay cannot duplicate wins or downgrade stars',()=>{
  const s=freshState();s.attempt.kind='campaign';s.attempt.level=1;s.attempt.street=[3];s.attempt.picked=[0];s.attempt.hinted=true;award(s);expect(s.progress[1].stars).toBe(2);expect(s.wins).toBe(1);
  s.attempt.credited=false;s.attempt.hinted=false;award(s);expect(s.progress[1].stars).toBe(3);expect(s.wins).toBe(1);
  s.attempt.revealed=true;award(s);expect(s.progress[1]).toEqual({stars:3,practiced:true});
  const practice=freshState();practice.attempt.kind='campaign';practice.attempt.revealed=true;award(practice);expect(practice.progress[1]).toEqual({stars:0,practiced:true});expect(practice.wins).toBe(0);expect(unlocked(practice.progress,2)).toBe(true);
 });
 test('daily repeated attempts do not duplicate wins',()=>{const s=freshState();s.attempt.kind='daily';s.attempt.day='2026-10-26';s.attempt.street=dailyStreet(s.attempt.day);award(s);s.attempt.credited=false;award(s);expect(s.wins).toBe(1);});
});
describe('Deterministic daily and sharing',()=>{
 test('uses Bucharest midnight, including daylight saving change',()=>{
  expect(localDay(new Date('2026-10-25T21:59:59Z'))).toBe('2026-10-25');
  expect(localDay(new Date('2026-10-25T22:00:00Z'))).toBe('2026-10-26');
  expect(dailyStreet('2026-10-26')).toEqual(dailyStreet('2026-10-26'));
  expect(dailyStreet('2026-10-26')).not.toEqual(dailyStreet('2026-10-27'));
 });
 test('roundtrips street only and rejects invalid rules',()=>{
  const a=freshState().attempt;expect(parseShared(shareHash(a))).toEqual({mode:a.mode,street:a.street});
  expect(()=>parseShared('#street='+encodeURIComponent(JSON.stringify({version:1,mode:'classic',street:[-1]})))).toThrow();
 });
});
describe('Backup validation and migration',()=>{
 test('roundtrip and isolation',()=>{const s=freshState(),v=validateState(s);v.attempt.street[0]=99;expect(s.attempt.street[0]).toBe(2);expect(validateState(clone(s))).toEqual(s);});
 test.each([
  s=>{delete s.attempt;},s=>{s.version=3;},s=>{s.wins=-1;},s=>{s.progress=[];},s=>{s.progress[31]={stars:3,practiced:false};},
  s=>{s.daily['2026-10-26']={stars:8,practiced:false};},s=>{s.attempt.picked=[0,1];},s=>{s.attempt.picked=[0,0];},s=>{s.attempt.picked=[40];},
  s=>{s.attempt.mode='circle';s.attempt.picked=[0,7];},s=>{s.attempt.kind='campaign';s.attempt.level=30;},s=>{s.attempt.kind='daily';s.attempt.day='2026-10-26';},
  s=>{delete s.still;},s=>{s.attempt.street=[null];}
 ])('rejects malformed or inconsistent backup %#',mutate=>{const s=freshState();mutate(s);expect(()=>validateState(s)).toThrow();});
 test('safe v1 migration and malformed fallback',()=>{
  expect(migrateV1({street:[2,1,2],mode:'classic',picked:[0,2],wins:4,lang:'en',assisted:true}).attempt.revealed).toBe(true);
  expect(migrateV1({street:[2,1],mode:'classic',picked:[0,1]})).toEqual(freshState());
 });
});
