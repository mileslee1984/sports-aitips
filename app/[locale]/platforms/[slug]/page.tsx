import { useTranslations } from "next-intl";

const platformData: Record<string, {
  name: string;
  rating: number;
  bonus: string;
  description: string;
  pros: string[];
  cons: string[];
}> = {
  "bc-game": {
    name: "BC.Game",
    rating: 4.8,
    bonus: "270% up to 20 BTC",
    description: "BC.Game is one of the most popular crypto casinos offering thousands of games, sports betting, and generous bonuses.",
    pros: ["Huge game selection", "Fast crypto withdrawals", "Generous welcome bonus", "24/7 live support"],
    cons: ["KYC required for large withdrawals", "Not available in some countries"],
  },
  "stake": {
    name: "Stake.com",
    rating: 4.7,
    bonus: "Free spins + Rakeback",
    description: "Stake is a leading crypto gambling platform known for its provably fair games and active community.",
    pros: ["Provably fair games", "VIP rakeback program", "Sports betting with live odds", "Fast payouts"],
    cons: ["No traditional payment methods", "Limited fiat options"],
  },
};

export default function PlatformDetailPage({ params }: { params: { slug: string } }) {
  const t = useTranslations("platforms");
  const platform = platformData[params.slug];

  if (!platform) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-gray-400">Platform not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold text-white">{platform.name}</h1>
        <span className="text-green-400 text-2xl font-bold">★ {platform.rating}</span>
      </div>
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8">
        <span className="text-green-400 font-semibold">{t("bonus")}:</span>{" "}
        <span className="text-white">{platform.bonus}</span>
      </div>
      <p className="text-gray-300 text-lg mb-10 leading-relaxed">{platform.description}</p>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-green-400 font-bold mb-3">✓ Pros</h2>
          <ul className="space-y-2">
            {platform.pros.map((pro) => (
              <li key={pro} className="text-gray-300 text-sm flex gap-2">
                <span className="text-green-500">+</span> {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-red-400 font-bold mb-3">✗ Cons</h2>
          <ul className="space-y-2">
            {platform.cons.map((con) => (
              <li key={con} className="text-gray-300 text-sm flex gap-2">
                <span className="text-red-500">−</span> {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <a
        href="#"
        className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold text-center py-4 rounded-xl text-lg transition-colors"
      >
        {t("visit")} {platform.name} →
      </a>
    </div>
  );
}
