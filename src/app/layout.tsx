import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "@/styles/globals.css";
import Logo from "@/components/Logo";
import UtmHashCapture from "@/components/UtmHashCapture";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export const metadata: Metadata = {
  title: "Blitzmailer — 30–60 Qualified Sales Calls / Month, Done For You",
  description:
    "Done-for-you cold email for B2B companies selling high-ticket services. We build, manage, and optimize the entire system. You focus on closing.",
  metadataBase: new URL("https://blitzmailer.site"),
  openGraph: {
    title: "Blitzmailer — 30–60 Qualified Sales Calls / Month, Done For You",
    description:
      "Done-for-you cold email for B2B companies selling high-ticket services.",
    type: "website",
    url: "https://blitzmailer.site",
    siteName: "Blitzmailer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blitzmailer — 30–60 Qualified Sales Calls / Month",
    description:
      "Done-for-you cold email for B2B. Built, managed, optimized end-to-end.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <UtmHashCapture />

        {/* Top bar — logo only, no nav per brief */}
        <header className="absolute left-0 right-0 top-0 z-20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
            <Logo size="md" />
            <span className="hidden text-xs text-zinc-500 sm:inline">
              Book a free strategy call →
            </span>
          </div>
        </header>

        {children}

        {/* ------- Meta Pixel ------- */}
        {META_PIXEL_ID ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}

        {/* ------- GA4 ------- */}
        {GA4_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
