import { useTranslations } from "next-intl";
import { getLiveMatches, type LiveMatch } from "@/lib/scores";
import { getUpcomingOdds, getBestOdds, type OddsMatch } from "@/lib/odds";

export const revalidate = 60;

const SPORT_KEYS = [
  { key: "soccer_epl", label: "Premier League" },
  { key: "soccer_spain_la_liga", label: "La Liga" },
  { key: "soccer_italy_serie_a", label: "Serie A" },
  { key: "basketball_nba", label: "NBA" },
];

export default async function SportsPage() {
  const [live, ...oddsResults] = await Promise.all([
    getLiveMatches(),
    ...SPORT_KEYS.map((s) => getUpcomingOdds(s.key)),
  ]);

  const upcoming: OddsMatch[] = oddsResults.flat().slice(0, 20);

  return <SportsContent live={live} upcoming={upcoming} />;
}

function SportsContent({
  live,
  upcoming,
}: {
  live: LiveMatch[];
  upcoming: OddsMatch[];
}) {
  const t = useTranslations("sports");
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-gray-400 mb-10">{t("subtitle")}</p>

      {live.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
            LIVE ({live.length})
          </h2>
          <div className="space-y-3">
            {live.slice(0, 12).map((m) => (
              <LiveMatchRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Matches & Odds</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">{t("no_matches")}</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((m) => (
              <UpcomingMatchRow key={m.id} match={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LiveMatchRow({ match }: { match: LiveMatch }) {
  return (
    <div className="bg-gray-900 border border-red-900/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="md:w-36">
        <span className="text-gray-500 text-xs truncate block">{match.tournament.name}</span>
      </div>
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold md:w-24 text-center w-fit">
        {match.status.description}
      </span>
      <div className="flex-1 flex items-center justify-center gap-3">
        <span className="text-white font-semibold text-right flex-1">{match.homeTeam.name}</span>
        <span className="text-white font-mono text-xl font-bold min-w-[70px] text-center">
          {match.homeScore.current ?? 0} - {match.awayScore.current ?? 0}
        </span>
        <span className="text-white font-semibold text-left flex-1">{match.awayTeam.name}</span>
      </div>
    </div>
  );
}

function UpcomingMatchRow({ match }: { match: OddsMatch }) {
  const odds = getBestOdds(match);
  const time = new Date(match.commenceTime).toLocaleString("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const home = odds[match.homeTeam];
  const away = odds[match.awayTeam];
  const draw = odds["Draw"];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="md:w-36">
        <span className="text-gray-500 text-xs">{match.sport}</span>
      </div>
      <span className="text-gray-400 text-sm md:w-24">{time}</span>
      <div className="flex-1 flex items-center justify-center gap-3">
        <span className="text-white font-semibold text-right flex-1">{match.homeTeam}</span>
        <span className="text-gray-500 font-mono text-lg min-w-[40px] text-center">vs</span>
        <span className="text-white font-semibold text-left flex-1">{match.awayTeam}</span>
      </div>
      {(home || away) && (
        <div className="flex gap-2">
          {home && <OddsButton label="1" value={home} />}
          {draw && <OddsButton label="X" value={draw} />}
          {away && <OddsButton label="2" value={away} />}
        </div>
      )}
    </div>
  );
}

function OddsButton({ label, value }: { label: string; value: number }) {
  return (
    <button className="bg-gray-800 hover:bg-green-500/20 border border-gray-700 hover:border-green-500 rounded-lg px-3 py-2 text-center transition-colors min-w-[52px]">
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="text-white font-bold text-sm">{value.toFixed(2)}</div>
    </button>
  );
}
