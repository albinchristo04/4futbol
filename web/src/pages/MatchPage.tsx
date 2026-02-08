import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Match } from '../lib/types';
import { fetchAllMatches } from '../lib/api';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { formatTime } from '../lib/utils'; // Add this hook
import { MessageCircle, Share2, Copy } from 'lucide-react';
import { BannerAd } from '../components/BannerAd';

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

    const shareText = `Watch ${match.title} Live on 4Futbol:`;
    const shareUrl = window.location.href;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

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
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                        {/* WhatsApp */}
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#25D366] rounded-sm hover:opacity-90 transition-opacity" title="Share on WhatsApp">
                            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.05c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </a>
                        {/* Telegram */}
                        <a href={telegramShareLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0088cc] rounded-sm hover:opacity-90 transition-opacity" title="Share on Telegram">
                            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12.023 12.023 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.62 4.505-.98 6.43-.153.823-.306 1.646-.438 2.3-.01.05-.018.094-.026.136-.051.264-.11.517-.184.757-.06.183-.22.422-.418.528-.152.081-.353.111-.532.083a3.52 3.52 0 01-1.077-.384 10.606 10.606 0 01-1.3-.923c-.777-.611-1.464-1.282-1.921-1.721l-1.018-.946c-.053-.05-.018-.112.016-.145.02-.02 2.37-2.193 3.32-3.08l.38-.352c.162-.15.352-.328.324-.48-.02-.117-.18-.198-.328-.21a1.277 1.277 0 00-.472.046c-.198.056-2.5 1.579-3.79 2.454a10.875 10.875 0 01-.893.553 4.282 4.282 0 01-.5.253 1.277 1.277 0 01-.81.015c-.156-.05-.316-.118-.466-.188l-.724-.328a6.115 6.115 0 01-.87-.442c-.221-.13-.421-.264-.528-.46-.102-.19-.015-.461.18-.62.148-.118.473-.243 1.096-.407l1.017-.266c1.1-.284 2.65-.68 4.05-1.02 1.4-.34 3-.722 4.3-.974.15-.028.3-.054.45-.074z" /></svg>
                        </a>
                        {/* Twitter/X */}
                        <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-black rounded-sm hover:opacity-90 transition-opacity" title="Share on Twitter">
                            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <button
                            onClick={() => navigator.clipboard.writeText(shareText + ' ' + shareUrl)}
                            className="p-2 bg-slate-800 rounded-sm hover:bg-slate-700 transition-colors"
                            title="Copy Link"
                        >
                            <Copy className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Banner Ad */}
                <BannerAd />

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

                {/* Telegram Join & DNS Notice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Telegram Join Button */}
                    <a
                        href="https://t.me/+VU3VSSNUnZo4MzE1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-3 bg-[#0088cc] hover:bg-[#0077b5] py-4 rounded-sm transition-all shadow-lg group"
                    >
                        <svg className="h-6 w-6 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12.023 12.023 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.62 4.505-.98 6.43-.153.823-.306 1.646-.438 2.3-.01.05-.018.094-.026.136-.051.264-.11.517-.184.757-.06.183-.22.422-.418.528-.152.081-.353.111-.532.083a3.52 3.52 0 01-1.077-.384 10.606 10.606 0 01-1.3-.923c-.777-.611-1.464-1.282-1.921-1.721l-1.018-.946c-.053-.05-.018-.112.016-.145.02-.02 2.37-2.193 3.32-3.08l.38-.352c.162-.15.352-.328.324-.48-.02-.117-.18-.198-.328-.21a1.277 1.277 0 00-.472.046c-.198.056-2.5 1.579-3.79 2.454a10.875 10.875 0 01-.893.553 4.282 4.282 0 01-.5.253 1.277 1.277 0 01-.81.015c-.156-.05-.316-.118-.466-.188l-.724-.328a6.115 6.115 0 01-.87-.442c-.221-.13-.421-.264-.528-.46-.102-.19-.015-.461.18-.62.148-.118.473-.243 1.096-.407l1.017-.266c1.1-.284 2.65-.68 4.05-1.02 1.4-.34 3-.722 4.3-.974.15-.028.3-.054.45-.074z" /></svg>
                        <span className="font-bold text-white uppercase tracking-wider">Join Telegram Group</span>
                    </a>

                    {/* DNS Notice */}
                    <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-4 rounded-sm">
                        <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                            <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                        </div>
                        <div className="text-xs">
                            <span className="text-white font-bold block mb-1">Stream not loading?</span>
                            <span className="text-slate-400 leading-tight">
                                Use <a href="https://1.1.1.1/" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Cloudflare DNS (1.1.1.1)</a> or a VPN to bypass blocks.
                            </span>
                        </div>
                    </div>
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
            </main >

    <Footer />
        </div >
    );
}
