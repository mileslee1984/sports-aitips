import { useTranslations } from "next-intl";
import { getLiveMatches, getScheduledMatches, type LiveMatch } from "@/lib/scores";
import { getUpcomingOdds, getBestOdds, type OddsMatch } from "@/lib/odds";

export const revalidate = 60;

export default async function SportsPage() {
  const [live, scheduled, oddsData] = await Promise.all([
    getLiveMatches(),
    getScheduledMatches(),
    getUpcomingOdds("soccer_epl"),
  ]);

  const oddsMap = new Map<string, Record<string, number>>();
  for (const match of oddsData) {
    const key = `${match.homeTeam}|${match.awayTeam}`;
    oddsMap.set(key, getBestOdds(match));
  }

  const liveIds = new Set(live.map((m) => m.id));
  const upcoming = scheduled.filter((m) => !liveIds.has(m.id)).slice(0, 15);

  return <SportsContent live={live} upcoming={upcoming} oddsMap={oddsMap} />;
}

function SportsContent({
  live,
  upcoming,
  oddsMap,
}: {
  live: LiveMatch[];
  upcoming: LiveMatch[];
  oddsMap: Map<string, Record<string, number>>;
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
            LIVE
          </h2>
          <div className="space-y-3">
            {live.slice(0, 10).map((m) => (
              <MatchRow key={m.id} match={m} isLive odds={oddsMap.get(`${m.homeTeam.name}|${m.awayTeam.name}`)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Today's Matches</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">{t("no_matches")}</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((m) => (
              <MatchRow key={m.id} match={m} isLive={false} odds={oddsMap.get(`${m.homeTeam.name}|${m.awayTeam.name}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MatchRow({
  match,
  isLive,
  odds,
}: {
  match: LiveMatch;
  isLive: boolean;
  odds?: Record<string, number>;
}) {
  const time = isLive
    ? match.status.description
    : new Date(match.startTimestamp * 1000).toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
      });

  const homeOdds = odds?.[match.homeTeam.name];
  const awayOdds = odds?.[match.awayTeam.name];
  const drawOdds = odds?.["Draw"];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-center gap-2 md:w-36">
        <span className="text-gray-500 text-xs truncate">{match.tournament.name}</span>
      </div>
      <div className="flex items-center gap-2 md:w-24">
        {isLive ? (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">{time}</span>
        ) : (
          <span className="text-gray-400 text-sm">{time}</span>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center gap-3">
        <span className="text-white font-semibold text-right flex-1">{match.homeTeam.name}</span>
        <span className="text-gray-400 font-mono text-lg min-w-[60px] text-center">
          {isLive && match.homeScore.current !== null
            ? `${match.homeScore.current} - ${match.awayScore.current}`
            : "vs"}
        </span>
        <span className="text-white font-semibold text-left flex-1">{match.awayTeam.name}</span>
      </div>
      {(homeOdds || awayOdds) && (
        <div className="flex gap-2">
          {homeOdds && <OddsButton label="1" value={homeOdds} />}
          {drawOdds && <OddsButton label="X" value={drawOdds} />}
          {awayOdds && <OddsButton label="2" value={awayOdds} />}
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
