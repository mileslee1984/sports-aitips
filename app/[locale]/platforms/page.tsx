import { useTranslations } from "next-intl";
import Link from "next/link";
import { getLocale } from "next-intl/server";

const platforms = [
  { slug: "bc-game", name: "BC.Game", rating: 4.8, bonus: "270% up to 20 BTC", tags: ["Crypto", "Sports", "Casino"], founded: 2017 },
  { slug: "stake", name: "Stake.com", rating: 4.7, bonus: "Free spins + Rakeback", tags: ["Crypto", "Sports", "Casino"], founded: 2017 },
  { slug: "bet365", name: "Bet365", rating: 4.6, bonus: "Up to $50 free bet", tags: ["Sports", "Live"], founded: 2000 },
  { slug: "1xbet", name: "1xBet", rating: 4.4, bonus: "100% up to $100", tags: ["Sports", "Casino", "Live"], founded: 2007 },
  { slug: "cloudbet", name: "Cloudbet", rating: 4.3, bonus: "100% up to 5 BTC", tags: ["Crypto", "Sports"], founded: 2013 },
];

export default function PlatformsPage() {
  const t = useTranslations("platforms");
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-gray-400 mb-10">{t("subtitle")}</p>
      <div className="space-y-4">
        {platforms.map((p, i) => (
          <PlatformRow key={p.slug} platform={p} rank={i + 1} t={t} />
        ))}
      </div>
    </div>
  );
}

function PlatformRow({
  platform,
  rank,
  t,
}: {
  platform: typeof platforms[0];
  rank: number;
  t: ReturnType<typeof useTranslations<"platforms">>;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="text-2xl font-bold text-gray-600 w-8">#{rank}</div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-bold text-white text-xl">{platform.name}</span>
          <span className="text-green-400 font-semibold">★ {platform.rating}</span>
        </div>
        <p className="text-gray-400 text-sm mb-2">
          {t("bonus")}: {platform.bonus}
        </p>
        <div className="flex flex-wrap gap-1">
          {platform.tags.map((tag) => (
            <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          href={`#`}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {t("visit")}
        </Link>
        <Link
          href={`platforms/${platform.slug}`}
          className="border border-gray-700 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          {t("review")}
        </Link>
      </div>
    </div>
  );
}
