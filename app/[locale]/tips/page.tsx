import { useTranslations } from "next-intl";
import { generateTips, type AiTip } from "@/lib/ai-tips";

export const revalidate = 3600; // 每小时重新生成一次

export default async function TipsPage() {
  const tips = await generateTips();
  return <TipsContent tips={tips} />;
}

function confidenceColor(confidence: number) {
  if (confidence >= 70) return "bg-green-500";
  if (confidence >= 60) return "bg-yellow-500";
  return "bg-orange-500";
}

function TipsContent({ tips }: { tips: AiTip[] }) {
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
  tip: AiTip;
  t: ReturnType<typeof useTranslations<"tips">>;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs uppercase tracking-wide">{tip.sport}</span>
        <span className="text-gray-500 text-xs flex items-center gap-1">
          ✦ {t("generated")}
        </span>
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
