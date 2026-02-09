import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { Header } from '../components/Header';
import { HeroSlider } from '../components/HeroSlider';
import { MatchCard } from '../components/MatchCard';
import { Footer } from '../components/Footer';
import { formatDate } from '../lib/utils';
import clsx from 'clsx';

export function HomePage() {
    const { matches, loading, error } = useMatches();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter'); // 'live'
    const sport = searchParams.get('sport');   // 'football', 'basketball'

    // Server source selection state (default 'all')
    const [selectedServer, setSelectedServer] = useState<'all' | 'Source 1' | 'Source 2'>('Source 1');

    // Filter Logic
    let filteredMatches = matches;
    if (filter === 'live') {
        filteredMatches = matches.filter(m => m.isLive);
    }
    if (sport) {
        // Simple text match on title/league
        filteredMatches = filteredMatches.filter(m =>
            m.title.toLowerCase().includes(sport) ||
            m.league.toLowerCase().includes(sport)
        );
    }

    // Filter by Selected Server
    if (selectedServer === 'Source 1') {
        filteredMatches = filteredMatches.filter(m => m.source === 'rojadirecta');
    } else if (selectedServer === 'Source 2') {
        filteredMatches = filteredMatches.filter(m => m.source === 'sportsevents');
    }

    const liveMatches = filteredMatches.filter(m => m.isLive);
    const upcomingMatches = filteredMatches.filter(m => !m.isLive);

    // Group upcoming by Date, then League
    const groupedUpcoming: Record<string, typeof upcomingMatches> = {};
    upcomingMatches.forEach(match => {
        const day = formatDate(match.timestamp);
        if (!groupedUpcoming[day]) groupedUpcoming[day] = [];
        groupedUpcoming[day].push(match);
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-red-500">
                <p>Error loading matches.</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-white underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-slate-200 font-sans">
            <Header />

            <main className="container px-4 py-8 md:px-6 space-y-12">
                {/* Server Selection Tabs */}
                <div className="flex justify-center space-x-4 mb-8">
                    {['Source 1', 'Source 2'].map((server) => (
                        <button
                            key={server}
                            onClick={() => setSelectedServer(server as any)}
                            className={clsx(
                                "px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-sm transition-all border",
                                selectedServer === server
                                    ? "bg-primary text-slate-950 border-primary"
                                    : "bg-surface text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                            )}
                        >
                            {server}
                        </button>
                    ))}
                    <button
                        onClick={() => setSelectedServer('all')}
                        className={clsx(
                            "px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-sm transition-all border",
                            selectedServer === 'all'
                                ? "bg-primary text-slate-950 border-primary"
                                : "bg-surface text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                        )}
                    >
                        All
                    </button>
                </div>

                {/* Hero Section (Live Highlighting) */}
                {liveMatches.length > 0 && (
                    <section>
                        <h2 className="mb-6 text-xl font-black uppercase text-white tracking-widest flex items-center">
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse mr-2" />
                            Featured Live
                        </h2>
                        <HeroSlider matches={liveMatches.slice(0, 5)} />
                    </section>
                )}

                {/* Live Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black uppercase text-white tracking-widest flex items-center">
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse mr-2" />
                            Live Now
                        </h2>
                        <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-sm">
                            {liveMatches.length} Matches
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {liveMatches.map(match => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                        {liveMatches.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-600 border border-dashed border-slate-800 rounded-sm">
                                No live matches at this moment from {selectedServer}. Checked your timezone?
                            </div>
                        )}
                    </div>
                </section>

                {/* Upcoming Schedule */}
                <section>
                    <h2 className="mb-6 text-xl font-black uppercase text-white tracking-widest">
                        Upcoming Matches
                    </h2>

                    <div className="space-y-8">
                        {Object.keys(groupedUpcoming).length === 0 && (
                            <div className="py-12 text-center text-slate-600 border border-dashed border-slate-800 rounded-sm">
                                No upcoming events found from {selectedServer}.
                            </div>
                        )}

                        {Object.entries(groupedUpcoming).map(([day, dayMatches]) => (
                            <div key={day} className="space-y-4">
                                <h3 className="sticky top-16 z-30 bg-background/95 backdrop-blur py-2 text-sm font-bold text-primary border-b border-primary/20">
                                    {day}
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {dayMatches.map(match => (
                                        <MatchCard key={match.id} match={match} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
