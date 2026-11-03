import ClientAssets from "./ClientAssets";
import "./assets.css";

// Private client download page. Reached only via the QR code (see scripts/generate-assets-qr.mjs);
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

export default function AssetsPage() {
  return <ClientAssets />;
}
