import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Match } from '../lib/types';
import { Link } from 'react-router-dom';
import { formatTime } from '../lib/utils'; // Add this import

interface HeroSliderProps {
    matches: Match[];
}

export function HeroSlider({ matches }: HeroSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320; // card width + gap
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (matches.length === 0) return null;

    return (
        <div className="relative group">
            {/* Controls */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-900/80 p-2 text-white opacity-0 transition-opacity hover:bg-primary group-hover:opacity-100"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-900/80 p-2 text-white opacity-0 transition-opacity hover:bg-primary group-hover:opacity-100"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Slider */}
            <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 md:px-0"
            >
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className="flex-none snap-start w-[85vw] sm:w-[400px] h-[220px] relative overflow-hidden rounded-md bg-slate-900 border border-slate-800 hover:border-accent/50 transition-colors"
                    >
                        {/* Background Gradient/Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />

                        {/* Content */}
                        <div className="relative z-10 flex h-full flex-col p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">{match.league}</span>
                                {match.isLive ? (
                                    <span className="bg-accent px-2 py-0.5 text-[10px] font-bold text-white animate-pulse rounded-sm">LIVE</span>
                                ) : (
                                    <span className="text-slate-400 text-xs">{formatTime(match.timestamp)}</span>
                                )}
                            </div>

                            <h2 className="text-2xl font-black uppercase text-white leading-none mb-auto">
                                {match.title}
                            </h2>

                            <Link
                                to={`/match/${match.id}`}
                                className="mt-4 inline-flex items-center justify-center bg-primary px-6 py-3 text-sm font-bold text-slate-950 hover:bg-white transition-colors uppercase tracking-wide rounded-sm"
                            >
                                Watch Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
