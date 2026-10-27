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
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try { document.documentElement.dataset.theme = localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'; } catch {} try { if (!sessionStorage.getItem('ayamikani-opening-loader-seen')) { sessionStorage.setItem('ayamikani-opening-loader-seen', '1'); document.documentElement.dataset.showOpeningLoader = 'true'; window.setTimeout(function () { delete document.documentElement.dataset.showOpeningLoader; }, 9000); } } catch {}",
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
