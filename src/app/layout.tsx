import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css"

import { headers } from "next/headers";
import { meta } from "@/config/meta";
import { viewport as v } from "@/config/meta";
import { cn } from "@/lib/utils";
import { ToastContainer } from "react-toastify";
import { SiteHeader } from "@/layout/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TRPCReactProvider } from "@/trpc/react";
import { TailwindIndicator } from "@/components/TailwindIndicator";

export const metadata = meta;
export const viewport = v;

import NextAuthProvider from "@/components/SessionProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
          >
            <TRPCReactProvider headers={headers()}>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
            </TRPCReactProvider>
            <ToastContainer position="bottom-right" theme="dark" />
            <TailwindIndicator />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
