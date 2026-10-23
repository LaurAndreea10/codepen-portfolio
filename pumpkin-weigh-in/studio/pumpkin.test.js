import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weighPumpkin as w,weighPumpkinInKilograms as kg,POUNDS_PER_KILOGRAM as LB,INVALID_WEIGHT as BAD} from './pumpkin.js';
test('exact boundaries and adjacent weights',()=>{
 for(const [n,c] of [[0,'Tiny Gourd'],[.999,'Tiny Gourd'],[1,'Mini'],[9.999,'Mini'],[10,'Carving'],[49.999,'Carving'],[50,'Giant'],[999.999,'Giant'],[1000,'Record Breaker!'],[2748.999,'Record Breaker!'],[2749,'Legendary'],[4000,'Legendary']]) assert.equal(w(n),c);
});
test('reject invalid values without coercing empty or boolean values to zero',()=>{
 for(const v of ['', ' ',null,undefined,true,false,[],{},NaN,Infinity,-Infinity,-1,'heavy']) assert.equal(w(v),BAD);
 assert.equal(w('22'),'Carving');
});
test('kilograms share classification and validation',()=>{
 for(const p of [.5,4,22,310,1247,3000]) assert.equal(kg(p/LB),w(p));
 for(const v of ['',null,true,-5,Infinity]) assert.equal(kg(v),BAD);
});
