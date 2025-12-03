'use client';

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search songs, artists, albums...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { isDarkMode } = useThemeStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-12 py-4 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500",
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
          )}
        />
        <SearchIcon 
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )} 
          size={20} 
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
