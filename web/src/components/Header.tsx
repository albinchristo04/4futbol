import { Link } from 'react-router-dom';
import { Menu, X, MonitorPlay } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 md:px-6">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <MonitorPlay className="h-6 w-6 text-primary" />
                    <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
                        futbol<span className="text-primary">.4rolls</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link to="/" className="transition-colors hover:text-primary">Home</Link>
                    <Link to="/?sport=football" className="transition-colors hover:text-primary">Football</Link>
                    <Link to="/?sport=basketball" className="transition-colors hover:text-primary">Basketball</Link>
                    <Link to="/?filter=live" className="transition-colors hover:text-accent animate-pulse">Live Now</Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="ml-auto md:hidden text-slate-200"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-surface p-4 space-y-4">
                    <Link to="/" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/?sport=football" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Football</Link>
                    <Link to="/?filter=live" className="block text-accent font-bold" onClick={() => setIsOpen(false)}>Live Now</Link>
                </div>
            )}
        </header>
    );
}
