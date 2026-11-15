# Publication identity

`projects.json` owns the localized titles, versions, destinations, completion dates
and GENOBOARD English summary. No runtime fetch is needed to display these cards.

After changing a tracked release, run:

```sh
node scripts/sync-publications.mjs
node scripts/sync-publications.mjs --check
```

With both repositories checked out next to each other:

```sh
node scripts/sync-publications.mjs --arcade ../ARCADE-WORLD
node scripts/sync-publications.mjs --check --arcade ../ARCADE-WORLD
```

Commit both repositories together. This updates the manifest snapshot in each
repository, the existing three EN card identities, and the Arhipelagul Arcade
card and iframe registry. Existing detailed EN descriptions and secondary links
are preserved. The tracked release list is at the top of the script; extend it
when adding a new publication. Other Arcade games are deliberately unmanaged.

CI rejects stale portfolio output. Cross-repository synchronization is explicit:
it does not deploy or write to the other repository from CI. A snapshot entry
does not mean the corresponding game has an Arcade launcher.

Mobile audits now include Arhipelagul and Baseline Voyage at 360/390/412 px.
Use `AUDIT_TARGET=kygo-arhipelagul AUDIT_SCHEME=light node scripts/mobile-a11y.mjs`
for a focused light audit; the default suite remains dark with reduced motion.
Lighthouse retains its existing score thresholds and adds these two URLs.

The first focused audit found visible-name mismatches and non-focusable code
blocks in Baseline Voyage. The accompanying HTML changes address those findings.
The shared Kygo launcher now clears Arhipelagul's bottom navigation; its script
URL and offline shell cache are versioned to deliver that correction.
