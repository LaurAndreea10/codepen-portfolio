# WebGPU Lab

## RO

Particule simulate pe placa video: un compute shader WGSL actualizează pozițiile și vitezele într-un storage buffer, iar un render pipeline citește același buffer (read-only) și desenează câte un pătrățel pe particulă, instanțiat. Fără WebGPU, aceeași fizică rulează în JavaScript pe Canvas 2D. Forțează fallback-ul cu `?mode=canvas`.

- Un singur fișier (`index.html`) plus stilul și comutatorul RO/EN comune din `assets/growth/`.
- 16 octeți pe particulă (`pos: vec2f`, `vel: vec2f`), uniform de 32 de octeți.
- Două module de shader: compute (`read_write`) și render (`read`), pentru că vertex shaderul nu are voie să lege storage `read_write`.

## EN

Particles simulated on the GPU: a WGSL compute shader updates positions and velocities in a storage buffer, and a render pipeline reads the same buffer (read-only) to draw one instanced quad per particle. Without WebGPU, the same physics runs in JavaScript on Canvas 2D (`?mode=canvas` forces it).

Made by Laura Andreea.
