# UTM Builder v1.1

> Micro-tool Marketing-Tech pentru link-uri tracked: validare UTM, presets, bulk generation și CSV export.

[Live Demo](https://laurandreea10.github.io/codepen-portfolio/utm-builder.html)

## Features

- Single link builder
- Bulk UTM generation from rows: `source, medium, content`
- CSV export
- Base URL validation
- UTM parameters: source, medium, campaign, content, term
- Presets: Newsletter, LinkedIn, Meta Ads, Google Search
- Clean naming validation: lowercase + underscore / dash
- Generated URL preview
- Copy URL
- Copy report
- Copy bulk CSV
- RO/EN toggle
- Dark/Light mode
- High contrast mode
- localStorage-ready state pattern
- Zero backend, GitHub Pages deployable

## Bulk input format

```txt
newsletter,email,hero_cta
linkedin,social,feed_post
meta,paid_social,creative_a
google,cpc,text_ad
```

Each row becomes one tracked link with the shared campaign name.

## Why it exists

UTM naming is one of the easiest places to lose clean analytics data. This tool turns manual URL tagging into a guided flow with presets and validation, so campaign links stay consistent across social, email and paid media. Version 1.1 adds bulk generation for campaign launches across multiple channels.

## Stack

- HTML
- CSS custom properties
- Vanilla JavaScript
- URLSearchParams
- Blob API for CSV download
- GitHub Pages

## Roadmap

- [x] Presets
- [x] Validation
- [x] Copy report
- [x] Bulk UTM generation
- [x] CSV export
- [ ] Naming convention profiles
- [ ] QR code export
- [ ] Saved campaign templates

## Author

Laura Andreea · [Portofoliu](https://laurandreea10.github.io/codepen-portfolio/) · [GitHub](https://github.com/LaurAndreea10)
