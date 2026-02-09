import { useState, useEffect } from 'react';

export function SiteLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading completion
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5 seconds loading time

        // Cleanup timer
        return () => clearTimeout(timer);
    }, []);

    // Don't render anything if not loading
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="text-center">
                {/* Loading Spinner */}
                <div className="relative mb-8">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-primary/20 animate-ping"></div>
                    </div>
                </div>
                
                {/* Loading Text */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                        4FUTBOL
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">
                        Loading matches...
                    </p>
                </div>
                
                {/* Loading Progress Dots */}
                <div className="flex justify-center space-x-1 mt-6">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
}