import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Política - Transparência Eleitoral",
  description:
    "Ferramenta para acompanhar votações e propostas dos parlamentares brasileiros. Transparência política para cidadãos informados.",
  keywords:
    "política, transparência, eleições, congresso, deputados, senadores, votações, Brasil",
  authors: [{ name: "Rafael Lebre" }],
  creator: "Rafael Lebre",
  publisher: "Política Transparência",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://politica-transparencia.vercel.app"),
  openGraph: {
    title: "Política - Transparência Eleitoral",
    description: "Acompanhe votações e propostas dos parlamentares brasileiros",
    url: "https://politica-transparencia.vercel.app",
    siteName: "Política Transparência",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Política - Transparência Eleitoral",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Política - Transparência Eleitoral",
    description: "Acompanhe votações e propostas dos parlamentares brasileiros",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
