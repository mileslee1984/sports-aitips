const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const BASE = "https://allsportsapi2.p.rapidapi.com/api";

const headers = {
  "x-rapidapi-host": "allsportsapi2.p.rapidapi.com",
  "x-rapidapi-key": RAPIDAPI_KEY,
};

export type LiveMatch = {
  id: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore: { current: number | null };
  awayScore: { current: number | null };
  status: { description: string; type: string };
  tournament: { name: string };
  startTimestamp: number;
};

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const res = await fetch(`${BASE}/matches/live`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.events ?? [];
}

export async function getScheduledMatches(): Promise<LiveMatch[]> {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const res = await fetch(`${BASE}/matches/${dateStr}`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.events ?? [];
}
