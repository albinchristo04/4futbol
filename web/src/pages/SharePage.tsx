import { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Copy, Check, Send } from 'lucide-react';
import { formatTime } from '../lib/utils';
import clsx from 'clsx';
import type { Match } from '../lib/types';

export function SharePage() {
    const { matches, loading } = useMatches();
    const [selectedServer, setSelectedServer] = useState<'Source 1' | 'Source 2'>('Source 1');
    const [copied, setCopied] = useState(false);

    // Filter matches by server
    const serverMatches = matches.filter(m =>
        selectedServer === 'Source 1'
            ? m.source === 'rojadirecta'
            : m.source === 'sportsevents'
    );

    // Filter only "Today's" or relevant upcoming matches
    const today = new Date().toDateString();
    const displayMatches = serverMatches.filter(m => {
        const d = new Date(m.timestamp).toDateString();
        return d === today || m.isLive;
    });

    const generateTelegramText = (match: Match) => {
        const time = formatTime(match.timestamp);
        const link = `https://futbol.4rolls.com/match/${match.id}`;
        return `⚽ ${match.title}\n🏆 ${match.league}\n⏰ ${time}\n📺 Watch: ${link}`;
    };

    const generateBulkText = () => {
        const header = `📅 *Today's Matches - ${selectedServer}*\n\n`;
        const list = displayMatches.map(m => {
            const time = formatTime(m.timestamp);
            return `⏰ ${time} | ${m.title}\n🔗 https://futbol.4rolls.com/match/${m.id}`;
        }).join('\n\n');
        return header + list + `\n\n👉 Watch all at: https://futbol.4rolls.com`;
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (loading) return <div className="text-center p-8 text-primary">Loading share tools...</div>;

    return (
        <div className="min-h-screen bg-background text-slate-200 font-sans">
            <Header />
            <main className="container max-w-3xl px-4 py-8 mx-auto space-y-8">
                <h1 className="text-2xl font-black uppercase text-white tracking-widest border-b border-primary/20 pb-4">
                    Telegram Share Tool
                </h1>

                {/* Server Toggle */}
                <div className="flex space-x-4">
                    {(['Source 1', 'Source 2'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setSelectedServer(s)}
                            className={clsx(
                                "flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-sm border transition-all",
                                selectedServer === s
                                    ? "bg-primary text-slate-950 border-primary"
                                    : "bg-surface text-slate-400 border-slate-800 hover:border-slate-600"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Bulk Actions */}
                <div className="bg-surface p-6 rounded-sm border border-slate-800">
                    <h2 className="text-lg font-bold text-white mb-4">Bulk Share (All Matches)</h2>
                    <textarea
                        readOnly
                        value={generateBulkText()}
                        className="w-full h-32 bg-background border border-slate-700 text-xs text-slate-400 p-2 mb-4 rounded-sm focus:outline-none"
                    />
                    <button
                        onClick={() => copyToClipboard(generateBulkText())}
                        className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-red-600 text-white font-bold py-3 rounded-sm transition-colors"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy All to Clipboard'}</span>
                    </button>
                </div>

                {/* Individual Matches */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white">Individual Matches</h2>
                    {displayMatches.length === 0 && (
                        <p className="text-slate-500 italic">No matches found for today.</p>
                    )}
                    {displayMatches.map(match => (
                        <div key={match.id} className="flex items-center justify-between bg-surface p-4 border border-slate-800 rounded-sm hover:border-slate-700">
                            <div className="flex-1">
                                <div className="text-xs font-bold text-primary mb-1">{formatTime(match.timestamp)}</div>
                                <div className="font-bold text-white text-sm">{match.title}</div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => copyToClipboard(generateTelegramText(match))}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-sm text-slate-300"
                                    title="Copy Text"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(`https://futbol.4rolls.com/match/${match.id}`)}&text=${encodeURIComponent(generateTelegramText(match))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-sky-600 hover:bg-sky-500 rounded-sm text-white"
                                    title="Share to Telegram"
                                >
                                    <Send className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
