# Three.js r128, găzduit local

`three-r128.min.js` este `build/three.min.js` din pachetul npm `three@0.128.0` (licență MIT, vezi `LICENSE`), neschimbat. SHA-256: `9274bbcec8d96168626c732b5d31c775aa8cfb7eaa0599bec0c175908a2c1ce2`.

De ce local: înainte se încărca de pe cdnjs (Cloudflare), deci fiecare vizită trimitea IP-ul vizitatorului unui terț (aceeași problemă GDPR ca la Google Fonts), iar în Kygo: Arhipelagul blocă afișarea paginii.

Cine îl folosește: Kygo: Arhipelagul, Kygo World, Kygo: Pe Urme și cache-ul offline din `kygo-universe/offline.js`. Jocurile îl încarcă abia la prima interacțiune sau când pornești un joc; până atunci rulează varianta 2D.
