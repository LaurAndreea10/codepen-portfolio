# Changelog — WebGPU Lab

## 1.0.0 — 2026-11-21 · Finalizat / Completed

- RO: Primul experiment WebGPU: între 16.384 și 1.048.576 de particule mișcate de un compute shader WGSL și desenate instanțiat din același buffer, cu amestec aditiv și culoare după viteză. Trei moduri (Atracție, Orbită, Curent), forță reglabilă, pauză, reîmprăștiere, control din mouse, atingere sau săgeți.
- RO: Fallback Canvas 2D cu aceeași fizică în JavaScript (500–6.000 de particule), ales automat fără WebGPU sau forțat cu `?mode=canvas`; eticheta din colț arată mereu calea. Mișcarea redusă pornește simularea pe pauză.
- EN: First WebGPU experiment: 16,384 to 1,048,576 particles moved by a WGSL compute shader and drawn instanced from the same buffer. Three modes, adjustable strength, pause, scatter, mouse/touch/arrow-key control. Canvas 2D fallback with the same physics (500–6,000 particles), automatic or forced with `?mode=canvas`; the corner label always shows the path. Reduced motion starts paused.
- Verificat în Chrome headless (SwiftShader): shaderele compilează, compute shaderul mută particulele spre atractor, iar render-ul desenează pixeli (citire înapoi din buffer și textură). Nu am verificat pe GPU-uri reale, Safari sau Firefox. / Checked in headless Chrome (SwiftShader) with buffer and texture read-back. Not checked on real GPUs, Safari or Firefox.
