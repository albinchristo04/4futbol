import { Link } from 'react-router-dom';
import { Play, Calendar } from 'lucide-react';
import type { Match } from '../lib/types';
import { formatTime, cn } from '../lib/utils'; // You might need to add cn utility

// Helper Types
interface MatchCardProps {
    match: Match;
    featured?: boolean;
}

export function MatchCard({ match }: Omit<MatchCardProps, 'featured'>) {
    const isLive = match.isLive;

    // Channels Logic
    const server1 = match.channels[0];
    const server2 = match.channels[1];

    return (
        <div className={cn(
            "group relative flex flex-col overflow-hidden bg-surface transition-all hover:border-primary/50",
            "p-4 border-l-4",
            isLive ? "border-l-accent bg-accent/5" : "border-l-transparent hover:border-l-primary"
        )}>
            {/* Glow Effect */}
            {isLive && <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent animate-ping m-2" />}

            {/* Header: League & Time */}
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="uppercase tracking-wider">{match.league}</span>
                <div className="flex items-center space-x-1">
                    {isLive ? (
                        <span className="text-accent font-bold animate-pulse">LIVE</span>
                    ) : (
                        <>
                            <Calendar className="h-3 w-3" />
                            <span>{formatTime(match.timestamp)}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Teams Title */}
            <h3 className="mb-4 text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors line-clamp-2">
                {match.title}
            </h3>

            {/* Action Buttons */}
            <div className="mt-auto grid grid-cols-2 gap-2">
                {server1 ? (
                    <Link
                        to={`/match/${match.id}?server=0`}
                        className="flex items-center justify-center space-x-2 bg-slate-800 py-2 text-xs font-bold text-white hover:bg-primary transition-colors"
                    >
                        <Play className="h-3 w-3" />
                        <span>SERVER 1</span>
                    </Link>
                ) : (
                    <button disabled className="bg-slate-900 py-2 text-xs text-slate-600 cursor-not-allowed">
                        Unavailable
                    </button>
                )}

                {server2 ? (
                    <Link
                        to={`/match/${match.id}?server=1`}
                        className="flex items-center justify-center space-x-2 bg-slate-800 py-2 text-xs font-bold text-white hover:bg-primary transition-colors"
                    >
                        <Play className="h-3 w-3" />
                        <span>SERVER 2</span>
                    </Link>
                ) : (
                    <button disabled className="bg-slate-900 py-2 text-xs text-slate-600 cursor-not-allowed">
                        Unavailable
                    </button>
                )}
            </div>
        </div>
    );
}
