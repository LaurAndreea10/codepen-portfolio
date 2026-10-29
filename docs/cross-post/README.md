# Cross-post pentru dev.to și Hashnode

Fișierele de aici sunt generate din `insights/*.html` cu:

```
node scripts/export-insights.mjs
```

Fiecare are `canonical_url` către pagina din portofoliu, deci motoarele de căutare tratează portofoliul ca sursă originală, iar cititorii de pe dev.to ajung la proiecte.

## Publicare pe dev.to

1. dev.to → Create Post → în editor, lipește tot fișierul `.md` (inclusiv blocul `---` de sus).
2. Verifică previzualizarea, apoi schimbă `published: false` în `published: true` sau apasă Publish.

## Publicare pe Hashnode

1. Write → lipește textul de sub al doilea `---`.
2. Article settings → „Are you republishing?” → lipește `canonical_url`.

## După publicare

Pune linkul postării în descrierea secțiunii de pe LinkedIn sau într-o postare scurtă: o idee din articol + link. Când adaugi un insight nou în `insights/`, rulează din nou scriptul.
