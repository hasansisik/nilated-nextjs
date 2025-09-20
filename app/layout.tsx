import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ReduxProvider } from '../components/ui/ReduxProvider';

export const metadata: Metadata = {
  title: "WordPress Clone",
  description: "A modern WordPress clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <Providers>
            {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
