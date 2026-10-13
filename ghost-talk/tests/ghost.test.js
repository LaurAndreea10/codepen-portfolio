// Real Jest entry point: the same specs the page runs in the Tests tab.
// The official starter tests live next to the rule, in ../ghosttalk.test.js.
const G = require('../engine.js');
const { ghostTalkText } = require('../ghosttalk.js');
const { GhostSpecs } = require('../ghost.spec.js');

G.useRule(ghostTalkText);
GhostSpecs({ describe, it, expect, test }, G);
