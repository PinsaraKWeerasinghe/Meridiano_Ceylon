import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { FlowbiteThemeProvider } from "@/components/providers/FlowbiteThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import {
  MaintenanceBanner,
  MaintenanceBannerSpacer,
} from "@/components/layout/MaintenanceBanner";
import { LOGO_ALT } from "@/lib/branding";
import { isMaintenanceMode } from "@/lib/maintenance";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Meridiano Ceylon | Luxury Sri Lanka Tours",
    template: "%s | Meridiano Ceylon",
  },
  description:
    "Tailor-made luxury tours across Sri Lanka — private journeys, specialty experiences, and the Meridiano Care Promise.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#0a1744",
  /* Tab + home-screen icons: `app/icon.png` + `app/apple-icon.png` (same artwork as LOGO_SRC) */
  appleWebApp: {
    title: LOGO_ALT,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenance = isMaintenanceMode();

  return (
    <html
      lang="en"
      style={
        !maintenance
          ? ({ "--maintenance-strip-h": "0px" } as CSSProperties)
          : undefined
      }
    >
      <body
        className={`${dmSans.variable} ${cormorant.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        {maintenance ? (
          <>
            <MaintenanceBanner />
            <MaintenanceBannerSpacer />
          </>
        ) : null}
        <FlowbiteThemeProvider>
          <Navbar maintenanceActive={maintenance} />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </FlowbiteThemeProvider>
      </body>
    </html>
  );
}
