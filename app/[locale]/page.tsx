import { useTranslations } from "next-intl";
import Link from "next/link";
import { getLocale } from "next-intl/server";

const platforms = [
  { slug: "bc-game", name: "BC.Game", rating: 4.8, bonus: "270% up to 20 BTC", tags: ["Crypto", "Sports", "Casino"] },
  { slug: "stake", name: "Stake.com", rating: 4.7, bonus: "Free spins + Rakeback", tags: ["Crypto", "Sports", "Casino"] },
  { slug: "bet365", name: "Bet365", rating: 4.6, bonus: "Up to $50 free bet", tags: ["Sports", "Live"] },
];

const tips = [
  { match: "Man City vs Arsenal", pick: "Man City Win", confidence: 72, sport: "Football" },
  { match: "Lakers vs Warriors", pick: "Over 225.5", confidence: 68, sport: "Basketball" },
  { match: "Djokovic vs Alcaraz", pick: "Alcaraz Win", confidence: 61, sport: "Tennis" },
];

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {t("hero_title")}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("hero_subtitle")}</p>
      </section>

      {/* Platforms */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("section_platforms")}</h2>
          <PlatformsLink t={t} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <PlatformCard key={p.slug} platform={p} />
          ))}
        </div>
      </section>

      {/* AI Tips */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("section_tips")}</h2>
          <TipsLink t={t} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <TipCard key={i} tip={tip} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PlatformCard({ platform }: { platform: typeof platforms[0] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-white text-lg">{platform.name}</span>
        <span className="text-green-400 font-semibold">★ {platform.rating}</span>
      </div>
      <p className="text-gray-400 text-sm mb-3">{platform.bonus}</p>
      <div className="flex flex-wrap gap-1">
        {platform.tags.map((tag) => (
          <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TipCard({ tip }: { tip: typeof tips[0] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="text-xs text-gray-500 mb-1">{tip.sport}</div>
      <div className="font-semibold text-white mb-1">{tip.match}</div>
      <div className="text-green-400 font-bold mb-3">{tip.pick}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-800 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${tip.confidence}%` }}
          />
        </div>
        <span className="text-sm text-gray-400">{tip.confidence}%</span>
      </div>
    </div>
  );
}

function PlatformsLink({ t }: { t: ReturnType<typeof useTranslations<"home">> }) {
  return (
    <Link href="#" className="text-green-400 text-sm hover:underline">
      {t("view_all")} →
    </Link>
  );
}

function TipsLink({ t }: { t: ReturnType<typeof useTranslations<"home">> }) {
  return (
    <Link href="#" className="text-green-400 text-sm hover:underline">
      {t("view_all")} →
    </Link>
  );
}
