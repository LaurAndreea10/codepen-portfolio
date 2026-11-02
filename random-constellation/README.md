# Random Constellation — CSS Random() Observatory

A single-file, browser-only experiment for the November CodePen CSS Random() challenge.

## What it includes

- CSS `random()` generates star positions, sizes, hues, opacity, timing, rotation and depth; JavaScript only builds the requested number of star elements and controls the interface.
- Romanian and English interface with saved language preference.
- Dark and light themes, high contrast, reduced motion, keyboard operation, visible focus and screen-reader announcements.
- 2D/3D view, optional pointer parallax, presets, adjustable star density, comet effect and Zen mode.
- Local preference saving, shareable configuration links and PNG export; no external services or dependencies.
- Static star placement when CSS `random()` is unsupported.

## Run

Open `index.html` in a browser. For the intended randomized view, use a browser that supports CSS `random()`. The fallback scene remains available in older browsers.

## Accessibility notes

The page follows the operating system's reduced-motion preference and provides manual motion and contrast controls. Star controls use roving keyboard focus: Tab enters the star field once; arrow keys move between stars. The planet and decorative layers are hidden from assistive technology.

## Challenge tags

`cpc-css-random` · `codepenchallenge`
