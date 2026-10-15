import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import WowProvider from "@/components/providers/WowProvider";

export const metadata = {
  title: "Candeur Kukatpally | Rooted in nature. Reaching for life.",
  description:
    "Discover nature-led 3 BHK residences in Kukatpally, Hyderabad, from ₹1.3 Cr onwards. Explore amenities, neighbourhood connections and home sizes. Get priority launch access.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/media/hero-frames/frame-001.webp" />
      </head>
      <body className="site-body">
        <WowProvider>{children}</WowProvider>
      </body>
    </html>
  );
}
