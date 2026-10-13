// Real Jest entry point for the Ghost Lab: the same specs the lab page runs in its Tests tab.
const G = require('../engine.js');
const { ghostTalkText } = require('../../ghosttalk.js');
const { GhostSpecs } = require('../ghost.spec.js');

G.useRule(ghostTalkText);
GhostSpecs({ describe, it, expect, test }, G);
