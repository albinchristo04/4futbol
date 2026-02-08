import type { Match } from "./types";

// Source 1 Updated URL
const SOURCE1_URL = "https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json";
// Source 2 URL remains same
const SOURCE2_URL = "https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/sports_events.json";

// Helper to check if match is approximately live (within 2 hours start)
export const isMatchLive = (matchTime: Date): boolean => {
    const now = new Date();
    const diff = (now.getTime() - matchTime.getTime()) / (1000 * 60); // minutes
    return diff >= -15 && diff <= 150;
};

export const hasMatchEnded = (matchTime: Date): boolean => {
    const now = new Date();
    const diff = (now.getTime() - matchTime.getTime()) / (1000 * 60);
    return diff > 150;
}

// Fetch Source 1 (FutbolLibre)
const fetchSource1 = async (): Promise<Match[]> => {
    try {
        const res = await fetch(SOURCE1_URL);
        const json = await res.json();
        const events = json.data || [];

        return events.map((item: any) => {
            const attr = item.attributes;
            // Parse Date
            // "date_diary": "2026-02-08", "diary_hour": "15:00:00"
            // Assumption: Argentina Time (UTC-3) as it defaults to Futbol Libre
            // ISO: 2026-02-08T15:00:00-03:00
            const isoString = `${attr.date_diary}T${attr.diary_hour}-03:00`;
            const dateObj = new Date(isoString);

            // Channels
            const channels = (attr.embeds?.data || []).map((embed: any) => ({
                name: embed.attributes.embed_name || "Server",
                url: embed.attributes.decoded_iframe_url || ""
            }));

            // Country/League
            const league = attr.country?.data?.attributes?.name || "General";

            return {
                id: `s1-${item.id}`,
                title: attr.diary_description || "Unknown Match",
                league,
                date: attr.date_diary,
                time: attr.diary_hour,
                timestamp: dateObj.toISOString(),
                isLive: isMatchLive(dateObj),
                source: 'rojadirecta', // Keeping internal key same or changing to 'futbollibre'
                channels
            } as Match;
        }).filter((match: Match) => {
            // Filter: Show only if (Start Time > Now - 3 hours)
            // i.e. has not ended more than ~1 hour ago (assuming 2h duration)
            const matchTime = new Date(match.timestamp).getTime();
            const now = Date.now();
            const threeHoursAgo = now - (3 * 60 * 60 * 1000);

            // Keep if match is in future OR started within last 3 hours
            return matchTime > threeHoursAgo;
        });
    } catch (e) {
        console.error("Source 1 Fetch Error", e);
        return [];
    }
};

// Fetch Source 2
const fetchSource2 = async (): Promise<Match[]> => {
    try {
        const res = await fetch(SOURCE2_URL);
        const data = await res.json();

        const lastUpdated = new Date(data.last_updated); // assumed UTC 'Z'
        const matches: Match[] = [];

        // Keys are Day Names: "SATURDAY", "SUNDAY"
        const dayNameMap: Record<string, number> = {
            "SUNDAY": 0, "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3, "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6
        };

        const refDay = lastUpdated.getUTCDay();

        Object.keys(data.events || {}).forEach(dayKey => {
            const targetDay = dayNameMap[dayKey.toUpperCase()];
            if (targetDay === undefined) return;

            // Calculate date diff (simple heuristic for "current week/weekend")
            let diff = targetDay - refDay;
            // If file updated Sunday, and key is Saturday (-1), likely yesterday.
            // If updated Monday, and key is Sunday (-1), yesterday.
            // If updated Friday, and key is Monday (-4), likely NEXT Monday (+3)? Or last Monday?
            // Heuristic: -2 <= diff <= 4. If outside, adjust by 7.
            // E.g. Ref=Sun(0), Target=Sat(6). Diff = 6. This is +6 days? Or -1 day?
            // usually these files show [Yesterday, Today, Tomorrow].

            if (diff < -1) diff += 7;
            if (diff > 5) diff -= 7;

            // Construct the date
            const matchDate = new Date(lastUpdated);
            matchDate.setUTCDate(matchDate.getUTCDate() + diff);
            const dateStr = matchDate.toISOString().split('T')[0];

            (data.events[dayKey] || []).forEach((ev: any) => {
                // Time is "HH:MM". Assume UTC.
                const isoUTC = `${dateStr}T${ev.time}:00Z`;
                const dateObj = new Date(isoUTC);

                // Generate ID from title + time + date to avoid weekly collisions
                const id = `s2-${ev.event.replace(/\s+/g, '-').toLowerCase()}-${ev.time.replace(':', '')}-${dateStr}`;

                matches.push({
                    id,
                    title: ev.event,
                    league: "Sports Events", // Source 2 doesn't list league often
                    date: dateStr,
                    time: ev.time,
                    timestamp: dateObj.toISOString(),
                    isLive: isMatchLive(dateObj),
                    source: 'sportsevents',
                    channels: (ev.streams || []).map((url: string, idx: number) => ({
                        name: `Server ${idx + 1}`,
                        url
                    }))
                });
            });
        });

        return matches;
    } catch (e) {
        console.error("Source 2 Fetch Error", e);
        return [];
    }
};

export const fetchAllMatches = async (): Promise<Match[]> => {
    const [s1, s2] = await Promise.all([fetchSource1(), fetchSource2()]);
    const all = [...s1, ...s2];

    // Sort by time
    return all.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
