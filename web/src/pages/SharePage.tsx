import { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Copy, Check, Send } from 'lucide-react';
import type { Match } from '../lib/types';
import clsx from 'clsx';
import { toZonedTime, format } from 'date-fns-tz';

export function SharePage() {
    const { matches, loading } = useMatches();
    const [selectedServer, setSelectedServer] = useState<'Source 1' | 'Source 2'>('Source 1');
    const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC');
    const [copied, setCopied] = useState(false);

    // Common Timezones
    const timezones = [
        { label: 'UTC', value: 'UTC' },
        { label: 'London (GMT)', value: 'Europe/London' },
        { label: 'Spain, Italy (CET)', value: 'Europe/Madrid' },
        { label: 'Argentina', value: 'America/Argentina/Buenos_Aires' },
        { label: 'New York (EST)', value: 'America/New_York' },
        { label: 'India (IST)', value: 'Asia/Kolkata' },
        { label: 'Brazil', value: 'America/Sao_Paulo' },
        { label: 'Mexico City', value: 'America/Mexico_City' },
        { label: 'Moscow', value: 'Europe/Moscow' },
        { label: 'China', value: 'Asia/Shanghai' },
    ];

    // Helper to format time based on selected TZ
    const formatTimeTZ = (timestamp: string) => {
        const date = new Date(timestamp);
        const zoned = toZonedTime(date, selectedTimezone);
        return format(zoned, 'HH:mm', { timeZone: selectedTimezone });
    };

    // Filter matches by server
    const serverMatches = matches.filter(m =>
        selectedServer === 'Source 1'
            ? m.source === 'rojadirecta'
            : m.source === 'sportsevents'
    );

    // Filter only "Today's" or relevant upcoming matches
    // Note: "Today" is tricky with TZs. We'll use local machine today for simplicity, 
    // or better, just show next 24h.
    // For simplicity, showing match if it starts within next 24h or is live.
    const now = new Date();
    const displayMatches = serverMatches.filter(m => {
        const d = new Date(m.timestamp);
        const diff = d.getTime() - now.getTime();
        // Show Live (-2h to 0) AND Upcoming (next 24h)
        return m.isLive || (diff > 0 && diff < 24 * 60 * 60 * 1000);
    });

    const generateTelegramText = (match: Match) => {
        const time = formatTimeTZ(match.timestamp);
        // We append tz param if app supported it, but mainly user wants TEXT to reflect TZ.
        const link = `https://futbol.4rolls.com/match/${match.id}`;

        // Find label
        const tzLabel = timezones.find(t => t.value === selectedTimezone)?.label || selectedTimezone;

        return `⚽ ${match.title}\n🏆 ${match.league}\n⏰ ${time} (${tzLabel})\n📺 Watch: ${link}`;
    };

    const generateBulkText = () => {
        const tzLabel = timezones.find(t => t.value === selectedTimezone)?.label || selectedTimezone;
        const header = `📅 *Today's Matches - ${selectedServer}*\n🕒 Timezone: ${tzLabel}\n\n`;
        const list = displayMatches.map(m => {
            const time = formatTimeTZ(m.timestamp);
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
            <main className="container max-w-3xl px-4 py-8 mx-auto space-y-6">
                <h1 className="text-2xl font-black uppercase text-white tracking-widest border-b border-primary/20 pb-4">
                    Telegram Share Tool
                </h1>

                {/* Configurations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Server Toggle */}
                    <div className="flex space-x-2">
                        {(['Source 1', 'Source 2'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedServer(s)}
                                className={clsx(
                                    "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-sm border transition-all",
                                    selectedServer === s
                                        ? "bg-primary text-slate-950 border-primary"
                                        : "bg-surface text-slate-400 border-slate-800 hover:border-slate-600"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Timezone Selector */}
                    <div className="bg-surface rounded-sm border border-slate-800 px-3 flex items-center">
                        <span className="text-xs text-slate-500 mr-2 uppercase font-bold">Timezone:</span>
                        <select
                            value={selectedTimezone}
                            onChange={(e) => setSelectedTimezone(e.target.value)}
                            className="bg-transparent text-white text-sm w-full py-2 focus:outline-none"
                        >
                            {timezones.map(tz => (
                                <option key={tz.value} value={tz.value} className="bg-slate-900">{tz.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="bg-surface p-6 rounded-sm border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white">Bulk Share List</h2>
                        <span className="text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded-full">
                            {displayMatches.length} Matches
                        </span>
                    </div>

                    <textarea
                        readOnly
                        value={generateBulkText()}
                        className="w-full h-32 bg-background border border-slate-700 text-xs text-slate-400 p-2 mb-4 rounded-sm focus:outline-none font-mono"
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
                        <p className="text-slate-500 italic">No matches found for upcoming 24h.</p>
                    )}
                    {displayMatches.map(match => (
                        <div key={match.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface p-4 border border-slate-800 rounded-sm hover:border-slate-700 gap-4">
                            <div className="flex-1">
                                <div className="text-xs font-bold text-primary mb-1">
                                    {formatTimeTZ(match.timestamp)}
                                    <span className="text-slate-500 ml-1 font-normal opacity-70">
                                        ({selectedTimezone.split('/')[1] || selectedTimezone})
                                    </span>
                                </div>
                                <div className="font-bold text-white text-sm line-clamp-1">{match.title}</div>
                                <div className="text-xs text-slate-400 mt-1">{match.league}</div>
                            </div>
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <button
                                    onClick={() => copyToClipboard(generateTelegramText(match))}
                                    className="flex-1 sm:flex-none flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-sm text-slate-300 transition-colors"
                                    title="Copy Text"
                                >
                                    <Copy className="h-4 w-4 mr-2 sm:mr-0" />
                                    <span className="sm:hidden text-xs font-bold">Copy</span>
                                </button>
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(`https://futbol.4rolls.com/match/${match.id}`)}&text=${encodeURIComponent(generateTelegramText(match))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-none flex items-center justify-center p-2 bg-sky-600 hover:bg-sky-500 rounded-sm text-white transition-colors"
                                    title="Share to Telegram"
                                >
                                    <Send className="h-4 w-4 mr-2 sm:mr-0" />
                                    <span className="sm:hidden text-xs font-bold">Send</span>
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
