import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayamikani Rukundo Emmanuel — Builder, learner, neighbor",
  description: "A portfolio of thoughtful technology and community work by Ayamikani Rukundo Emmanuel.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
