import { useEffect } from 'react';

export function AdsterraPopup() {
    useEffect(() => {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://pl28674382.effectivegatecpm.com/70/61/73/706173a2f090622107c8ff833a0914ef.js';
        script.async = true;
        
        // Add script to document head
        document.head.appendChild(script);
        
        // Cleanup function to remove script when component unmounts
        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    return null; // This component doesn't render anything visible
}