import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Match } from '../lib/types';
import { fetchAllMatches } from '../lib/api';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { formatTime } from '../lib/utils'; // Add this hook
import { MessageCircle, Share2, Copy } from 'lucide-react';

export function MatchPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [serverIndex, setServerIndex] = useState(parseInt(searchParams.get('server') || '0'));

    useEffect(() => {
        async function load() {
            try {
                const matches = await fetchAllMatches();
                const found = matches.find(m => m.id === id);
                if (found) setMatch(found);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading Stream...</div>;
    if (!match) return <div className="min-h-screen bg-background flex items-center justify-center text-red-500">Match not found.</div>;

    const currentChannel = match.channels[serverIndex] || match.channels[0];
    const streamUrl = currentChannel?.url;

    const shareText = `Watch ${match.title} Live: ${window.location.href}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(match.title)}`;

    return (
        <div className="min-h-screen bg-background text-slate-200 font-sans">
            <Header />

            <main className="container max-w-4xl px-4 py-8 mx-auto">
                {/* Match Header */}
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-primary/20 pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">{match.league}</span>
                        <h1 className="text-2xl md:text-3xl font-black text-white mt-1 leading-tight">{match.title}</h1>
                        <p className="text-sm text-slate-400 mt-2 flex items-center">
                            <span className="bg-red-500 w-2 h-2 rounded-full mr-2 animate-pulse" />
                            {match.isLive ? "LIVE NOW" : `Starts at ${formatTime(match.timestamp)}`}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-600 rounded-sm hover:bg-green-700 transition-colors">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </a>
                        <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-500 rounded-sm hover:bg-sky-600 transition-colors">
                            <Share2 className="h-5 w-5 text-white" />
                        </a>
                        <button
                            onClick={() => navigator.clipboard.writeText(shareText)}
                            className="p-2 bg-slate-800 rounded-sm hover:bg-slate-700 transition-colors"
                        >
                            <Copy className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Player Container */}
                <div className="aspect-video w-full bg-black relative mb-4 overflow-hidden rounded-sm border border-slate-800 shadow-2xl flex items-center justify-center group">
                    {streamUrl ? (
                        <iframe
                            src={streamUrl}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                            title={match.title}
                        />
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-red-500 font-bold mb-2">Stream Offline</p>
                            <p className="text-slate-500 text-sm">Waiting for signal...</p>
                        </div>
                    )}
                </div>

                {/* Server Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                    {match.channels.map((channel, idx) => (
                        <button
                            key={idx}
                            onClick={() => setServerIndex(idx)}
                            className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-sm transition-all border ${serverIndex === idx
                                ? "bg-primary text-slate-950 border-primary"
                                : "bg-surface text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                                }`}
                        >
                            {channel.name || `Server ${idx + 1}`}
                        </button>
                    ))}
                    {match.channels.length === 0 && (
                        <div className="col-span-full p-4 text-center text-slate-500 text-sm italic">
                            No servers available.
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="bg-surface p-6 rounded-sm border border-slate-800/50">
                    <h3 className="tex-sm font-bold text-white uppercase mb-2">Streaming Rules</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Please allow popups if the stream requires it. If "Server 1" is buffering, try "Server 2".
                        Streams are hosted externally. We do not control ads or content.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
