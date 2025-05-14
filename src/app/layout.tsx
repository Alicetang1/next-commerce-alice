import { CartProvider } from "@/components/cart/cart-context";
import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alavie Studio",
  description:
    " A dreamy clothing label for girls who believe in beauty, softness, and self-expression.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = cookies().get("cartId")?.value;
  const cart = getCart(cartId);
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider cartPromise={cart}>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
