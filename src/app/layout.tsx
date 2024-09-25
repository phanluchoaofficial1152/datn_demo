"use client";

import "./globals.css";
import Headers from "@/components/Headers";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Provider } from "react-redux";
import store from "@/store/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <title>MUSIC MALL</title>
        <link
          rel="icon"
          sizes="32x32"
          type="image/png"
          href="https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png"
        />
        <link
          rel="icon"
          sizes="16x16"
          type="image/png"
          href="https://open.spotifycdn.com/cdn/images/favicon16.1c487bff.png"
        />
        <link
          rel="icon"
          href="https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico"
        ></link>
      </head>
      <body className={`container mx-auto`}>
        <Provider store={store}>
          <Headers />
          <Toaster position="top-center" />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="datn-theme"
          >
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
