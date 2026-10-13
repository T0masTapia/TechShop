import Header from "@/components/Header";
import "./globals.css";
import { Metadata } from "next";
import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "@/components/ThemeProviders";

export const metadata: Metadata = {
  title: "Tech Shop",
  description: "Tienda de tecnología y periféricos",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className="bg-slate-50 text-gray-900 dark:bg-[#050505] dark:text-white antialiased min-h-screen flex flex-col overflow-x-hidden transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {/* Cabecera unificada (Navbar + CategoryNav) */}
            <Header />

            {/* Contenido dinámico flex-1 para empujar el contenido al final */}
            <main className="flex-1 w-full">
              {children}
            </main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}