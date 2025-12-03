'use client';

import { useState } from 'react';
import { deezerService } from '@/lib/deezer';
import { Track } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import TrackList from '@/components/TrackList';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';
import { SearchX } from 'lucide-react';

export default function SearchPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { isDarkMode } = useThemeStore();

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await deezerService.search(query);
      setTracks(data.data);
    } catch (error) {
      console.error('Search error:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className={cn(
          "text-4xl md:text-5xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Search Music
        </h1>
        <p className={cn(
          "text-lg",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Find your favorite songs, artists, and albums
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 mt-8">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-24 rounded-xl animate-pulse",
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              )}
            ></div>
          ))}
        </div>
      ) : searched ? (
        tracks.length > 0 ? (
          <div className="mt-8">
            <TrackList tracks={tracks} title={`Found ${tracks.length} results`} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <SearchX size={64} className="text-gray-400" />
            <p className={cn(
              "text-xl",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              No results found. Try another search term.
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <p className={cn(
            "text-xl",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Start searching for your favorite music
          </p>
        </div>
      )}
    </div>
  );
}
