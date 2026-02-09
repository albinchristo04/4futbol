import { useEffect } from 'react';

export function AdsterraPopup() {
    useEffect(() => {
        // Ensure we're in browser environment
        if (typeof window === 'undefined' || !document) {
            return;
        }

        // Create script element with additional attributes for better compatibility
        const script = document.createElement('script');
        script.src = 'https://pl28674382.effectivegatecpm.com/70/61/73/706173a2f090622107c8ff833a0914ef.js';
        script.async = true;
        script.defer = true; // Add defer as fallback
        script.type = 'text/javascript';
        
        // Add error handling
        script.onerror = () => {
            console.warn('Adsterra popup script failed to load');
        };
        
        script.onload = () => {
            console.log('Adsterra popup script loaded successfully');
        };
        
        // Try multiple insertion points for maximum compatibility
        const insertScript = () => {
            // First try head
            if (document.head) {
                document.head.appendChild(script);
                return true;
            }
            // Fallback to body
            if (document.body) {
                document.body.appendChild(script);
                return true;
            }
            // Last resort - append to document
            document.appendChild(script);
            return true;
        };
        
        // Insert the script
        const success = insertScript();
        
        if (!success) {
            console.error('Failed to insert Adsterra popup script');
            return;
        }
        
        // Cleanup function to remove script when component unmounts
        return () => {
            try {
                // Remove from head
                if (document.head && document.head.contains(script)) {
                    document.head.removeChild(script);
                }
                // Remove from body
                else if (document.body && document.body.contains(script)) {
                    document.body.removeChild(script);
                }
                // Remove from document
                else if (document.contains(script)) {
                    document.removeChild(script);
                }
            } catch (error) {
                console.warn('Error cleaning up Adsterra script:', error);
            }
        };
    }, []);

    return null; // This component doesn't render anything visible
}