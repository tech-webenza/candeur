import fs from "fs";
import path from "path";
import ClientAssets from "./ClientAssets";
import "./assets.css";

// Private client download page. Reached only via the QR code;
// intentionally not linked from any navigation, footer or sitemap.
export const metadata = {
  title: "Client Downloads | Candeur",
  description: "Files shared privately with you by Candeur.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
};

// Every file dropped into this folder is listed automatically at build time.
const ASSETS_FOLDER = "87533e9d9c65ffea1d44fdd7";
const IGNORED = new Set(["manifest.json", "index.html"]);

function readAssets() {
  const dir = path.join(process.cwd(), "public", "client-assets", ASSETS_FOLDER);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && !IGNORED.has(entry.name))
    .map((entry) => ({ file: entry.name, size: fs.statSync(path.join(dir, entry.name)).size }))
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
}

export default function AssetsPage() {
  return <ClientAssets folder={ASSETS_FOLDER} files={readAssets()} />;
}
