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

const slugify = (text: string) =>
    text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

// Fetch Source 1 (FutbolLibre)
const fetchSource1 = async (): Promise<Match[]> => {
    try {
        const res = await fetch(SOURCE1_URL);
        const json = await res.json();
        const events = json.data || [];

        return events.map((item: any) => {
            const attr = item.attributes;
            const isoString = `${attr.date_diary}T${attr.diary_hour}-03:00`;
            const dateObj = new Date(isoString);

            const channels = (attr.embeds?.data || []).map((embed: any) => ({
                name: embed.attributes.embed_name || "Server",
                url: embed.attributes.decoded_iframe_url || ""
            }));

            const league = attr.country?.data?.attributes?.name || "General";
            const slug = slugify(attr.diary_description || "match");

            return {
                id: `${slug}-${item.id}`,
                title: attr.diary_description || "Unknown Match",
                league,
                date: attr.date_diary,
                time: attr.diary_hour,
                timestamp: dateObj.toISOString(),
                isLive: isMatchLive(dateObj),
                source: 'rojadirecta',
                channels
            } as Match;
        }).filter((match: Match) => {
            const matchTime = new Date(match.timestamp).getTime();
            const now = Date.now();
            const threeHoursAgo = now - (3 * 60 * 60 * 1000);
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

        const lastUpdated = new Date(data.last_updated);
        const matches: Match[] = [];

        const dayNameMap: Record<string, number> = {
            "SUNDAY": 0, "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3, "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6
        };

        const refDay = lastUpdated.getUTCDay();

        Object.keys(data.events || {}).forEach(dayKey => {
            const targetDay = dayNameMap[dayKey.toUpperCase()];
            if (targetDay === undefined) return;

            let diff = targetDay - refDay;
            if (diff < -1) diff += 7;
            if (diff > 5) diff -= 7;

            const matchDate = new Date(lastUpdated);
            matchDate.setUTCDate(matchDate.getUTCDate() + diff);
            const dateStr = matchDate.toISOString().split('T')[0];

            (data.events[dayKey] || []).forEach((ev: any) => {
                const isoUTC = `${dateStr}T${ev.time}:00Z`;
                const dateObj = new Date(isoUTC);

                const slug = slugify(ev.event || "match");
                // Create more stable ID using date, time, and event name
                const stableId = `${dateStr}-${ev.time}-${slug}`;
                const id = `s2-${stableId}`;

                matches.push({
                    id,
                    title: ev.event,
                    league: "Sports Events",
                    date: dateStr,
                    time: ev.time,
                    timestamp: dateObj.toISOString(),
                    isLive: isMatchLive(dateObj),
                    source: 'sportsevents',
                    channels: (ev.streams || []).map((url: string, i: number) => ({
                        name: `Server ${i + 1}`,
                        url
                    }))
                });
            });
        });

        return matches.filter((match: Match) => {
            const matchTime = new Date(match.timestamp).getTime();
            const now = Date.now();
            const threeHoursAgo = now - (3 * 60 * 60 * 1000);
            return matchTime > threeHoursAgo;
        });

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
