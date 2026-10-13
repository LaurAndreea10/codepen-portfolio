// Lets Jest run the challenge's ES-module test (import { ghostTalk } from "./ghosttalk.js").
// "unambiguous" keeps engine.js and ghost.spec.js as plain scripts.
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  sourceType: 'unambiguous'
};
