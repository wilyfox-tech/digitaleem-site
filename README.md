# digitaleem.co

A static website: no framework, no build dependencies, nothing to install. Node 18 or newer is all you need.

```
node src/build.js            # builds dist/     — upload this to the host
node src/build.js preview    # builds preview/  — same site, for link previews
node src/build.js wp         # builds wordpress/digitaleem/ — the WordPress theme (zip it to upload)
```

Then upload the contents of `dist/` to any static host (Netlify, Cloudflare Pages, Vercel, GitHub
Pages, or ordinary shared hosting). Point digitaleem.co at it. `dist/404.html` is the not-found page.

## What to edit

| To change | Edit |
| --- | --- |
| Email, phone, social links | `src/data/site.js` |
| Program pages (the 8 offerings) | `src/data/programs.js` |
| Domain pages (IT, engineering, business) | `src/data/domains.js` |
| Every other page's words | `src/pages.js` |
| Enquiry form questions | `src/assets/js/forms.js` |
| Internship, job and project listings | `src/assets/data/opportunities.js` |
| Colours, type, spacing | `src/assets/css/site.css` (the `:root` block at the top) |

Rebuild after any change.

## Enquiry forms

Forms validate in the browser and currently run in **preview mode**: nothing is sent anywhere, and
the person sees a confirmation that says so. To start receiving enquiries, set `formEndpoint` in
`src/assets/js/config.js` to a form service that accepts a JSON POST (Formspree, Web3Forms, or a
Google Apps Script web app that writes to a Sheet), add any key it needs to `formExtra`, and rebuild.

Every form sends its answers plus which form it was and which page it came from.

## Opportunities

`src/assets/data/opportunities.js` is an empty list with the format documented at the top of the
file. Add one object per real opening and rebuild: the Opportunities pages, the filters and each
listing's application form all follow automatically. While the list is empty, the pages show an
honest empty state rather than fake listings.

## Later phases

The sitemap reserves URLs for Events, Stories, Resources, Partners, Careers, specialisation pages
and the student profile and accounts. None of them is built yet, and nothing links to them, so
adding them later moves nothing.

## WordPress

The live site runs as a WordPress theme built from the same source. `node src/build.js wp` writes `wordpress/digitaleem/`; zip that folder (`cd wordpress && zip -r digitaleem.zip digitaleem`) and upload it under Appearance > Themes.

- Hand-written theme code is in `src/wp/` (PHP templates, `inc/` for pages, settings, enquiries and opportunities). The header, footer, 404 and every page's content are generated into the theme on each build.
- Activating the theme creates all pages. After changing content here, upload the new zip and use Settings > Digitaleem > "Update pages from the theme".
- Forms post to `/wp-json/digitaleem/v1/enquiry`: saved under Enquiries in the dashboard and emailed to the address in Settings > Digitaleem.
- Opportunities are added in the dashboard, not in `opportunities.js` (that file is only used by the static build).
- `src/wp/README.txt` is the install guide that ships inside the theme.
