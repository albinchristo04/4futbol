export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-surface py-6 text-center text-sm text-slate-500">
            <div className="container px-4">
                <p>© {new Date().getFullYear()} futbol.4rolls.com. All rights reserved.</p>
                <p className="mt-2 text-xs">
                    DMCA: We do not host any content. All streams are embedded from external sources.
                </p>
            </div>
        </footer>
    );
}
