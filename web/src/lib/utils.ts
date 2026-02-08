import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format a date string to user's local time HH:mm
export function formatTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    } catch (e) {
        return "TBD";
    }
}

// Format date to local user's "Today", "Tomorrow", or "Mon 12 Feb"
export function formatDate(isoString: string): string {
    try {
        const date = new Date(isoString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        } else {
            return new Intl.DateTimeFormat('default', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }).format(date);
        }
    } catch (e) {
        return "";
    }
}
