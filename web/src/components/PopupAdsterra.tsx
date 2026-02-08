import { useEffect } from 'react';

export function PopupAdsterra() {
    useEffect(() => {
        // Check if script already exists to avoid re-adding
        const existingScript = document.querySelector('script[src*="effectivegatecpm.com"]');
        if (existingScript) return;

        const timer = setTimeout(() => {
            const script = document.createElement('script');
            script.src = 'https://pl28674382.effectivegatecpm.com/70/61/73/706173a2f090622107c8ff833a0914ef.js';
            script.async = true;
            document.body.appendChild(script);
        }, 2000); // 2-second delay to let the UI finish loading and become interactive

        return () => clearTimeout(timer);
    }, []);

    return null; // This component doesn't render anything
}
