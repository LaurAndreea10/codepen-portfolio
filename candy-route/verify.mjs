import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxCandy, bestRoute } from './candy.js';
const cases=[ [[],0],[[5],5],[[2,7],7],[[9,4],9],[[1,2,3,1],4],[[2,7,9,3,1],12],[[5,1,1,5],10],[[2,1,1,2],4],[[4,5,4],8],[[6,7,6,1],12],[[0,0,0],0],[[0,3,0,0,4],7],[Array(100).fill(1),50]];
for(const [a,total] of cases)test(`starter: ${a.slice(0,10)} → ${total}`,()=>assert.equal(maxCandy(a),total));
function brute(a,circle){let best=0;for(let mask=0;mask<2**a.length;mask++){let sum=0,valid=true;for(let i=0;i<a.length;i++)if(mask&(1<<i)){if(i>0&&(mask&(1<<(i-1))))valid=false;sum+=a[i];}if(circle&&a.length>1&&(mask&1)&&(mask&(1<<(a.length-1))))valid=false;if(valid)best=Math.max(best,sum);}return best;}
test('exhaustive oracle: 19,531 arrays × linear/circular, negatives, zeros and ties',()=>{
 for(let n=0;n<=6;n++)for(let code=0;code<5**n;code++){let k=code;const a=Array.from({length:n},()=>{const v=k%5-2;k=Math.floor(k/5);return v;});const original=[...a];
 for(const circle of [false,true]){const r=bestRoute(a,circle);assert.equal(r.total,brute(a,circle));assert.equal(r.indices.reduce((s,i)=>s+a[i],0),r.total);assert.equal(new Set(r.indices).size,r.indices.length);for(let i=1;i<r.indices.length;i++)assert.ok(r.indices[i]-r.indices[i-1]>1);if(circle&&n>1)assert.ok(!(r.indices.includes(0)&&r.indices.includes(n-1)));if(!circle)assert.equal(maxCandy(a),r.total);}
 assert.deepEqual(a,original);
 }
});
