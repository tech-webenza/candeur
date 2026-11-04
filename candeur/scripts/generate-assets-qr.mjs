// Generates the private QR code for the /assets client download page.
//
//   npm run qr:assets -- https://www.your-domain.com
//   npm run qr:assets -- https://www.your-domain.com/subdirectory   (if deployed under a subfolder/basePath)
//
// The QR encodes <site>/assets#<key>, where <key> is the folder name in public/client-assets/.
// Output goes to qr-codes/ (git-ignored, outside public/) so it is never published with the site.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "public", "client-assets");

const args = process.argv.slice(2);
const keyFlag = args.indexOf("--key");
const keyArg = keyFlag >= 0 ? args.splice(keyFlag, 2)[1] : null;
// --html: for hosts without clean URLs, point at /assets.html instead of /assets.
const htmlFlag = args.indexOf("--html");
const pagePath = htmlFlag >= 0 ? (args.splice(htmlFlag, 1), "/assets.html") : "/assets";
const siteArg = args[0] ?? process.env.SITE_URL;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!siteArg) fail("Pass the production site URL, e.g. npm run qr:assets -- https://www.your-domain.com");

let site;
try {
  site = new URL(siteArg);
} catch {
  fail(`"${siteArg}" is not a valid URL.`);
}
if (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(site.hostname)) fail("Refusing to create a QR code for localhost.");
if (site.protocol !== "https:") fail("Use the https:// production URL.");

const keys = fs
  .readdirSync(assetsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(assetsDir, d.name, "manifest.json")))
  .map((d) => d.name);
const key = keyArg ?? (keys.length === 1 ? keys[0] : null);
if (!key) fail(`Found ${keys.length} asset folders (${keys.join(", ")}). Choose one with --key <folder>.`);
if (!keys.includes(key)) fail(`No public/client-assets/${key}/manifest.json found.`);

const basePath = site.pathname.replace(/\/+$/, "");
const url = `${site.origin}${basePath}${pagePath}#${key}`;

let svg = renderToStaticMarkup(
  createElement(QRCodeSVG, {
    value: url,
    size: 1024,
    level: "Q",
    marginSize: 4,
    bgColor: "#ffffff",
    fgColor: "#142b22",
    title: "Candeur client downloads",
  })
);
if (!svg.includes("xmlns=")) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

const outDir = path.join(root, "qr-codes");
fs.mkdirSync(outDir, { recursive: true });
const svgPath = path.join(outDir, "candeur-client-assets-qr.svg");
fs.writeFileSync(svgPath, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
fs.writeFileSync(path.join(outDir, "candeur-client-assets-url.txt"), `${url}\n`);

console.log(`\n✔ QR code written to ${path.relative(root, svgPath)}`);
console.log(`  Encodes: ${url}\n`);
