import type { Match } from "./types";

const SOURCE1_URL = "https://raw.githubusercontent.com/albinchristo04/blogger-autopost/refs/heads/main/rojadirecta_events.json";
const SOURCE2_URL = "https://raw.githubusercontent.com/albinchristo04/mayiru/refs/heads/main/sports_events.json";

// Helper to check if match is approximately live (within 2 hours start)
export const isMatchLive = (matchTime: Date): boolean => {
    const now = new Date();
    const diff = (now.getTime() - matchTime.getTime()) / (1000 * 60); // minutes
    // Live if started between -10 mins ago and +120 mins ago? 
    // Sports match duration ~ 2 hours.
    // Actually "Live" usually means: Current Time > Start Time AND Current Time < Start Time + Duration (e.g. 150 mins).
    return diff >= -15 && diff <= 150;
};

export const hasMatchEnded = (matchTime: Date): boolean => {
    const now = new Date();
    const diff = (now.getTime() - matchTime.getTime()) / (1000 * 60);
    return diff > 150;
}

// Fetch Source 1
const fetchSource1 = async (): Promise<Match[]> => {
    try {
        const res = await fetch(SOURCE1_URL);
        const data = await res.json();

        // Assumption: Source 1 times are CET (UTC+1).
        // But data says "2026-02-03". We need to handle offsets carefully.
        // If strict CET:
        // "2026-02-03 19:00:00" => Parse as "2026-02-03T19:00:00+01:00"

        return (data.events || []).map((ev: any) => {
            // Build ISO string with offset
            const isoCET = `${ev.date}T${ev.time}+01:00`;
            const dateObj = new Date(isoCET);

            return {
                id: `s1-${ev.id}`,
                title: ev.description || ev.event || "Unknown Match", // Source 1 uses 'description'
                league: ev.country || "General",
                date: ev.date,
                time: ev.time,
                timestamp: dateObj.toISOString(),
                isLive: isMatchLive(dateObj),
                source: 'rojadirecta',
                channels: (ev.channels || []).map((c: any) => ({
                    name: c.name || "Server",
                    url: c.decoded_url || c.url || ""
                }))
            } as Match;
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
