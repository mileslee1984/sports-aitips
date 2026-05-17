import { useTranslations } from "next-intl";

const tips = [
  {
    sport: "Football",
    match: "Man City vs Arsenal",
    pick: "Man City Win or Draw",
    reason: "Man City have won 8 of their last 10 home games. Arsenal's away form has been inconsistent, with 3 losses in 5 road games.",
    confidence: 72,
    odds: 1.85,
  },
  {
    sport: "Basketball",
    match: "Lakers vs Warriors",
    pick: "Over 225.5 Points",
    reason: "Both teams rank in the top 5 for offensive efficiency. Recent meetings have averaged 231 combined points.",
    confidence: 68,
    odds: 1.92,
  },
  {
    sport: "Tennis",
    match: "Djokovic vs Alcaraz",
    pick: "Alcaraz Win",
    reason: "Alcaraz has won 3 of their last 4 meetings on hard courts. Current form heavily favors the younger player.",
    confidence: 61,
    odds: 2.0,
  },
  {
    sport: "Football",
    match: "Barcelona vs Real Madrid",
    pick: "Both Teams to Score",
    reason: "BTTS has landed in 9 of the last 12 El Clasico matches. Both sides have been in strong scoring form.",
    confidence: 76,
    odds: 1.75,
  },
];

function confidenceColor(confidence: number) {
  if (confidence >= 70) return "bg-green-500";
  if (confidence >= 55) return "bg-yellow-500";
  return "bg-red-500";
}

export default function TipsPage() {
  const t = useTranslations("tips");
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-gray-400 mb-2">{t("subtitle")}</p>
      <p className="text-yellow-500 text-sm mb-10">⚠ {t("disclaimer")}</p>
      <div className="grid md:grid-cols-2 gap-5">
        {tips.map((tip, i) => (
          <TipCard key={i} tip={tip} t={t} />
        ))}
      </div>
    </div>
  );
}

function TipCard({
  tip,
  t,
}: {
  tip: typeof tips[0];
  t: ReturnType<typeof useTranslations<"tips">>;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs uppercase tracking-wide">{tip.sport}</span>
        <span className="text-gray-400 text-xs">{t("generated")}</span>
      </div>
      <h2 className="text-white font-semibold text-lg mb-1">{tip.match}</h2>
      <div className="text-green-400 font-bold text-xl mb-3">{tip.pick}</div>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{tip.reason}</p>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500 text-xs">{t("confidence")}</span>
            <span className="text-white text-sm font-semibold">{tip.confidence}%</span>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className={`${confidenceColor(tip.confidence)} h-2 rounded-full transition-all`}
              style={{ width: `${tip.confidence}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-xs">Odds</div>
          <div className="text-white font-bold text-lg">{tip.odds.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
