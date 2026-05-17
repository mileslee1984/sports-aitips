import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "zh-TW" | "zh-CN")) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-500 text-sm">
            © 2026 AiTips.bet · For entertainment only · Bet responsibly
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
