import { useRef, useEffect } from 'react';

declare global {
    interface Window {
        atOptions?: any;
    }
}

export function BannerAd() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && !containerRef.current.firstChild) {
            const conf = document.createElement('script');
            conf.type = 'text/javascript';
            conf.innerHTML = `
            atOptions = {
                'key' : '22f60cbde184452b7131b5d5083e812f',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
            };
        `;
            containerRef.current.appendChild(conf);

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://www.highperformanceformat.com/22f60cbde184452b7131b5d5083e812f/invoke.js';
            script.async = true; // Essential for React
            containerRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="flex justify-center my-6">
            <div ref={containerRef} className="flex justify-center items-center bg-slate-900/50 rounded-sm overflow-hidden" style={{ minWidth: '300px', minHeight: '250px' }}>
            </div>
        </div>
    );
}
