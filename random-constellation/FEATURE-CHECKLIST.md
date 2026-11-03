# Random Constellation — 48-point coverage audit

Checked against `random-constellation/index.html` on 2 November 2026. Each item maps to an implemented control, CSS rule, or accessibility behavior. This is a source-level audit; manual testing with assistive technology and browsers that do not yet support CSS `random()` is not claimed.

## Randomness · 1–10

1. [x] CSS `random()` chooses each star's horizontal position.
2. [x] CSS `random()` chooses each star's vertical position.
3. [x] Stars receive varied sizes, with a separate size range for larger stars.
4. [x] CSS `random()` chooses star hues within the selected palette.
5. [x] CSS `random()` varies star opacity.
6. [x] CSS `random()` varies twinkle duration.
7. [x] CSS `random()` varies animation delay.
8. [x] CSS `random()` varies star rotation.
9. [x] CSS `random()` assigns depth; JavaScript does not calculate star random values.
10. [x] Regenerating the sky creates new star elements so CSS generates a fresh composition.

## 3D · 11–17

11. [x] The observatory has a perspective-based 3D scene.
12. [x] Stars use depth-aware `translate3d()` transforms.
13. [x] The planet sits forward in the scene and uses layered shading.
14. [x] Orbital rings and the nebula add depth cues.
15. [x] Vertical tilt is adjustable with a labeled control.
16. [x] Horizontal tilt is adjustable with a labeled control.
17. [x] A control switches between 3D and flat 2D views.

## Interaction and personalization · 18–27

18. [x] The density control changes the number of stars.
19. [x] Four atmosphere presets change the hue range.
20. [x] Three field formations are available: scattered, orbit and cluster.
21. [x] Brightness can be adjusted.
22. [x] Pulse tempo can be adjusted.
23. [x] 3D depth can be adjusted.
24. [x] A comet can be launched through the scene.
25. [x] Settings can be saved in local storage.
26. [x] A local gallery saves up to three skies.
27. [x] Saved skies can be restored; Zen mode, recipe sharing and PNG export are available.

## Romanian and English · 28–31

28. [x] The interface has a Romanian/English language toggle.
29. [x] Controls, guidance, status messages and gallery text have translations.
30. [x] Switching language updates the document language and accessible names.
31. [x] Shared recipes preserve language and selected scene settings, including both tilt values.

## Accessibility and compatibility · 32–40

32. [x] A skip link moves keyboard users directly to controls.
33. [x] The page uses headings and labeled sections for clear navigation.
34. [x] Interactive controls are native buttons, selects and inputs with accessible names.
35. [x] Stars can be navigated with arrow keys and activated from the keyboard.
36. [x] Status changes use a polite live region.
37. [x] High-contrast mode is available.
38. [x] Reduced motion is supported through a user setting and the system preference; animation can also be paused.
39. [x] The layout adapts to narrow screens and keeps primary controls touch-sized.
40. [x] Browsers without CSS `random()` receive a static constellation fallback.

## Night Oracle merge · 41–48 (v1.1.0, Oracle edition at `oracle/index.html`)

41. [x] CSS `random(0, 11, 1)` picks one of 12 fortunes, shown by shifting a strip.
42. [x] CSS `random(1, 6, 1)` rolls three dice; their total is a CSS counter.
43. [x] “Link the dice” uses the shared `--dice` key so all three dice match.
44. [x] The lucky hue comes from `random()` within the active atmosphere preset.
45. [x] Nebulae and meteors in the scene get position, size, angle and timing from `random()`.
46. [x] Roll again (button or R key) replaces the oracle element so CSS picks new values.
47. [x] The oracle result is announced in a polite live region and translated RO/EN.
48. [x] Pause, reduced motion and Zen mode cover the new animations; a JS fallback keeps the oracle working without `random()`.

## Audit result

**48/48 points covered in source.** The project is recorded as completed in the Romanian and English portfolio entries, catalogue, history and sitemap.
