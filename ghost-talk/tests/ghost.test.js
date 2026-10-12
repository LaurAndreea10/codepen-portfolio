// Real Jest entry point: the same specs the page runs in the Tests tab.
const G = require('../engine.js');
const { GhostSpecs } = require('../ghost.spec.js');

GhostSpecs({ describe, it, expect }, G);
