import { useTranslations } from "next-intl";

const matches = [
  {
    sport: "Football",
    homeTeam: "Man City",
    awayTeam: "Arsenal",
    homeScore: 1,
    awayScore: 1,
    status: "LIVE 67'",
    odds: { home: 2.1, draw: 3.4, away: 3.6 },
  },
  {
    sport: "Basketball",
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    homeScore: 89,
    awayScore: 94,
    status: "LIVE Q3",
    odds: { home: 2.8, draw: null, away: 1.5 },
  },
  {
    sport: "Football",
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    homeScore: null,
    awayScore: null,
    status: "Today 20:45",
    odds: { home: 2.3, draw: 3.2, away: 3.1 },
  },
  {
    sport: "Tennis",
    homeTeam: "Djokovic",
    awayTeam: "Alcaraz",
    homeScore: null,
    awayScore: null,
    status: "Tomorrow 14:00",
    odds: { home: 1.9, draw: null, away: 2.0 },
  },
];

export default function SportsPage() {
  const t = useTranslations("sports");
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-gray-400 mb-10">{t("subtitle")}</p>
      <div className="space-y-3">
        {matches.map((match, i) => (
          <MatchRow key={i} match={match} t={t} />
        ))}
      </div>
    </div>
  );
}

function MatchRow({
  match,
  t,
}: {
  match: typeof matches[0];
  t: ReturnType<typeof useTranslations<"sports">>;
}) {
  const isLive = match.status.startsWith("LIVE");
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-2 w-32">
        <span className="text-gray-500 text-xs">{match.sport}</span>
      </div>
      <div className="flex items-center gap-2">
        {isLive && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold animate-pulse">
            {match.status}
          </span>
        )}
        {!isLive && (
          <span className="text-gray-500 text-sm">{match.status}</span>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center gap-4">
        <span className="text-white font-semibold">{match.homeTeam}</span>
        <span className="text-gray-400 font-mono text-lg">
          {match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : "vs"}
        </span>
        <span className="text-white font-semibold">{match.awayTeam}</span>
      </div>
      <div className="flex gap-2">
        <OddsButton label={match.homeTeam.split(" ")[0]} value={match.odds.home} />
        {match.odds.draw && <OddsButton label="X" value={match.odds.draw} />}
        <OddsButton label={match.awayTeam.split(" ")[0]} value={match.odds.away!} />
      </div>
    </div>
  );
}

function OddsButton({ label, value }: { label: string; value: number }) {
  return (
    <button className="bg-gray-800 hover:bg-green-500/20 border border-gray-700 hover:border-green-500 rounded-lg px-3 py-2 text-center transition-colors min-w-[60px]">
      <div className="text-gray-400 text-xs">{label}</div>
      <div className="text-white font-bold">{value.toFixed(2)}</div>
    </button>
  );
}
