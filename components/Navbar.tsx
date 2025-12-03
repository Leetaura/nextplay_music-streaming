'use client';

import Link from 'next/link';
import { Search, Home, ListMusic, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/playlist', icon: ListMusic, label: 'Playlist' },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-50 backdrop-blur-md border-b transition-colors",
      isDarkMode 
        ? "bg-gray-900/80 border-gray-800" 
        : "bg-white/80 border-gray-200"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">♪</span>
            </div>
            <span className={cn(
              "text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            )}>
              NextPlay
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {links.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                  pathname === href
                    ? isDarkMode
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500 text-white"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
