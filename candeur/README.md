# Candeur Kukatpally — website source

Complete Next.js / React source and local assets for the landing-page preview.

## Run locally

Use Node.js 20 or newer and pnpm 10 or newer.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000.

Alternatively, use `npm install` followed by `npm run dev`. The supplied lockfile is for pnpm.

## Build and host

```sh
pnpm build
```

The static website is exported to `out/`. Upload the contents of that directory to a static host at the domain root. To preview the exported website locally, run `python3 -m http.server 4173 --directory out` and open http://localhost:4173. Do not use `next start`: this project uses static export.

## Private client downloads (`/assets`)

An unlisted download page for clients, opened by scanning a QR code. It is not linked from anywhere on the site and is marked `noindex`.

- Files and their list live in `public/client-assets/<key>/`. `manifest.json` in that folder controls the titles, groups and download names shown on the page.
- The QR code points to `https://<domain>/assets#<key>`. Without the key the page shows only a "scan your QR code" message, and the key never appears in the site's HTML or JavaScript.
- **Add or replace a file:** copy it into the key folder, then add an entry under a group in `manifest.json`: `{ "name": "Display name", "file": "file-name.pdf", "downloadName": "Saved-As.pdf" }`. File type and size are detected automatically. Rebuild and redeploy.
- **Generate the QR code:** `node scripts/generate-assets-qr.mjs https://www.your-domain.com`. `npm run qr:assets -- <url>` also works, except in Windows PowerShell, which drops extra flags. Add the subfolder if the site is deployed under one. This writes `qr-codes/candeur-client-assets-qr.svg`, which is git-ignored and never published. Send it to the client directly.
- **Revoke access:** rename the key folder to a new random string, redeploy and generate a new QR code. Old QR codes then show "This link is no longer active".
- The host must serve `/assets` from `assets.html` (clean URLs; most static hosts do this). If yours doesn't, add `--html` to the QR command so it links to `/assets.html#<key>` instead.
- This keeps the link unguessable, but it is not a login: anyone who has the QR code or the full link can download the files.

## Included

- `app/page.jsx`: page content, form demo, amenity tabs, neighbourhood selector, residence selector, FAQs and scroll animation.
- `app/globals.css`: desktop/mobile styling and typography.
- `app/layout.jsx`: metadata, asset preloads and page shell.
- `public/fonts/`: Kellissa and Archivo font files.
- `public/images/`: every bundled lifestyle and amenity image.
- `public/media/`: both bundled hero MP4 versions, poster and all 56 WebP frames used for scroll-driven playback.
- Dependency lockfile and Next.js configuration.
- `DESIGN.md` and `PRODUCT.md`: design and product handoff context.

The temporary Figma capture script has been removed from this delivery copy. The working project and published website were not changed.

## Important production notes

- This is a concept preview, not a production lead-collection integration. OTP is a clearly labelled demo (1234); no enquiry data is sent or saved. Connect a real OTP provider and CRM before campaigns.
- Images and hero film are illustrative, not actual project visuals. Approved masterplan and floor-plan assets are still awaited.
- Verify location distances, pricing, project claims, RERA disclosures and consent requirements before launch.
- Metadata currently requests search engines not to index the preview.
- Google Maps/directions need internet access. Other imagery and fonts are bundled locally. JavaScript dependencies are installed from their package registries.
- Confirm appropriate font and media usage rights for your deployment and distribution.

Live reference: https://candeur-kukatpally-preview.rahulgnsh.chatgpt.site/

Figma: https://www.figma.com/design/k696WhFlhQfexp0llPKZMJ
