import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUpcomingOdds, getBestOdds, type OddsMatch } from "./odds";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type AiTip = {
  match: string;
  sport: string;
  pick: string;
  reason: string;
  confidence: number;
  odds: number;
};

export async function generateTips(): Promise<AiTip[]> {
  const sports = [
    { key: "soccer_epl", name: "Football (EPL)" },
    { key: "basketball_nba", name: "Basketball (NBA)" },
  ];

  const allMatches: { sport: string; match: OddsMatch; odds: Record<string, number> }[] = [];

  for (const sport of sports) {
    const matches = await getUpcomingOdds(sport.key);
    for (const match of matches.slice(0, 5)) {
      const odds = getBestOdds(match);
      if (Object.keys(odds).length > 0) {
        allMatches.push({ sport: sport.name, match, odds });
      }
    }
  }

  if (allMatches.length === 0) return getFallbackTips();

  const matchList = allMatches
    .slice(0, 8)
    .map(({ sport, match, odds }) => {
      const oddsStr = Object.entries(odds)
        .map(([k, v]) => `${k}: ${v.toFixed(2)}`)
        .join(", ");
      return `- ${sport}: ${match.homeTeam} vs ${match.awayTeam} | Odds: ${oddsStr}`;
    })
    .join("\n");

  const prompt = `You are a sports betting analyst. Based on these upcoming matches and their odds, provide 4 betting tips.

Matches:
${matchList}

For each tip, respond with a JSON array (no markdown, raw JSON only):
[
  {
    "match": "Team A vs Team B",
    "sport": "Football",
    "pick": "specific bet recommendation",
    "reason": "2-3 sentence analysis based on odds value",
    "confidence": 65,
    "odds": 1.95
  }
]

Rules:
- confidence must be 55-80 (realistic, never overconfident)
- pick should be specific (e.g. "Home Win", "Over 2.5 Goals", "Both Teams to Score")
- reason should mention odds value and a brief logical argument
- only include bets with positive expected value based on odds`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const json = text.replace(/```json\n?|\n?```/g, "").trim();
    const tips: AiTip[] = JSON.parse(json);
    return tips.slice(0, 6);
  } catch {
    return getFallbackTips();
  }
}

function getFallbackTips(): AiTip[] {
  return [
    {
      match: "Man City vs Arsenal",
      sport: "Football",
      pick: "Both Teams to Score",
      reason: "Both sides have scored in 8 of their last 10 meetings. Current odds of 1.75 represent good value.",
      confidence: 72,
      odds: 1.75,
    },
    {
      match: "Lakers vs Warriors",
      sport: "Basketball",
      pick: "Over 225.5 Points",
      reason: "These teams average 118+ points each per game. The total of 225.5 looks beatable at 1.90.",
      confidence: 67,
      odds: 1.9,
    },
  ];
}
