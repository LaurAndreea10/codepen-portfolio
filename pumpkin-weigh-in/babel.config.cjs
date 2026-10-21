// Lets Jest run the challenge's ES-module test (import { weighPumpkin } from "./pumpkin.js").
// "unambiguous" keeps other files as plain scripts.
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  sourceType: 'unambiguous'
};
