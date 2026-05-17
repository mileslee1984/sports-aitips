"use client";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const localeLabels: Record<string, string> = {
  en: "EN",
  "zh-TW": "繁中",
  "zh-CN": "简中",
};

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: string) => {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/platforms`, label: t("platforms") },
    { href: `/${locale}/sports`, label: t("sports") },
    { href: `/${locale}/tips`, label: t("tips") },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="text-white font-bold text-xl tracking-tight">
          AiTips<span className="text-green-400">.bet</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(localeLabels).map(([loc, label]) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                locale === loc
                  ? "bg-green-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
