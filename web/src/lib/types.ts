export interface Channel {
    name: string;
    url: string; // The iframe URL or page URL
    decoded_url?: string; // The direct stream URL if available
}

export interface Match {
    id: string; // Unique ID (generate one for Source 2)
    title: string; // "Team A vs Team B"
    league: string; // "Premier League", "NBA", etc.
    date: string; // YYYY-MM-DD
    time: string; // HH:MM:SS (Local or Source Time)
    timestamp: string; // ISO string for sorting
    isLive: boolean;
    channels: Channel[];
    source: 'rojadirecta' | 'sportsevents';
}
