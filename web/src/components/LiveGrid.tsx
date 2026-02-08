import type { Match } from '../lib/types';
import { MatchCard } from './MatchCard';

interface LiveGridProps {
    matches: Match[];
}

export function LiveGrid({ matches }: LiveGridProps) {
    if (matches.length === 0) {
        return (
            <div className="py-12 text-center text-slate-500">
                <p>No live matches currently available.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}
