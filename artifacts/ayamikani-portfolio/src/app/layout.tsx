import type { Metadata } from "next";
import type { ReactNode } from "react";
import OpeningLoader from "@/components/opening-loader";
import NavigationFeedback from "@/components/navigation-feedback";
import PortfolioLiveSync from "@/components/portfolio-live-sync";
import ViewportFrame from "@/components/viewport-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayamikani Rukundo Emmanuel — Builder, learner, neighbor",
  description: "A portfolio of thoughtful technology and community work by Ayamikani Rukundo Emmanuel.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    title: "Ayamikani Rukundo Emmanuel — Builder, learner, neighbor",
    description: "A portfolio of thoughtful technology and community work by Ayamikani Rukundo Emmanuel.",
    siteName: "Ayamikani Rukundo Emmanuel",
  },
  twitter: {
    card: "summary",
    title: "Ayamikani Rukundo Emmanuel — Builder, learner, neighbor",
    description: "A portfolio of thoughtful technology and community work by Ayamikani Rukundo Emmanuel.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try { document.documentElement.dataset.theme = localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'; } catch {} try { if (!sessionStorage.getItem('ayamikani-opening-loader-seen')) { sessionStorage.setItem('ayamikani-opening-loader-seen', '1'); document.documentElement.dataset.showOpeningLoader = 'true'; window.setTimeout(function () { delete document.documentElement.dataset.showOpeningLoader; }, 2700); } } catch {}",
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <OpeningLoader />
        <NavigationFeedback />
        <PortfolioLiveSync />
        <ViewportFrame />
        {children}
      </body>
    </html>
  );
}
