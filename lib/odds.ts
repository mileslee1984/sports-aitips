const ODDS_API_KEY = process.env.ODDS_API_KEY!;
const BASE = "https://api.the-odds-api.com/v4";

export type OddsMatch = {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  bookmakers: {
    name: string;
    markets: {
      key: string;
      outcomes: { name: string; price: number }[];
    }[];
  }[];
};

export async function getUpcomingOdds(sport = "soccer_epl"): Promise<OddsMatch[]> {
  const res = await fetch(
    `${BASE}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=uk&markets=h2h&oddsFormat=decimal`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getSports() {
  const res = await fetch(`${BASE}/sports/?apiKey=${ODDS_API_KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export function getBestOdds(match: OddsMatch) {
  const outcomes: Record<string, number> = {};
  for (const bm of match.bookmakers) {
    for (const market of bm.markets) {
      if (market.key === "h2h") {
        for (const outcome of market.outcomes) {
          if (!outcomes[outcome.name] || outcome.price > outcomes[outcome.name]) {
            outcomes[outcome.name] = outcome.price;
          }
        }
      }
    }
  }
  return outcomes;
}
