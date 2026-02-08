import { useEffect } from 'react';

export function AdsterraPopup() {
    useEffect(() => {
        // Load Adsterra Popup Ad
        const adsterraScript = document.createElement('script');
        adsterraScript.src = 'https://pl28674382.effectivegatecpm.com/70/61/73/706173a2f090622107c8ff833a0914ef.js';
        adsterraScript.async = true;
        
        // Load AddThis CPA Ad
        const addthisScript = document.createElement('script');
        addthisScript.src = 'https://qkzpkdm.com/cu/f61797eca7ec2e1d.js?force_https=1';
        addthisScript.async = true;
        
        // Add scripts to document head
        document.head.appendChild(adsterraScript);
        document.head.appendChild(addthisScript);
        
        // Cleanup function to remove scripts when component unmounts
        return () => {
            if (document.head.contains(adsterraScript)) {
                document.head.removeChild(adsterraScript);
            }
            if (document.head.contains(addthisScript)) {
                document.head.removeChild(addthisScript);
            }
        };
    }, []);

    return null; // This component doesn't render anything visible
}