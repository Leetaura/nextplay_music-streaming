'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';
import TrackList from '@/components/TrackList';
import { ListMusic, Trash2, Play } from 'lucide-react';

export default function PlaylistPage() {
  const { playlist, clearPlaylist, setCurrentTrack } = usePlayerStore();
  const { isDarkMode } = useThemeStore();

  const playPlaylist = () => {
    if (playlist.length > 0) {
      setCurrentTrack(playlist[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className={cn(
        "rounded-3xl p-8 md:p-12 shadow-2xl",
        "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <ListMusic size={32} />
              <span className="text-sm font-semibold uppercase tracking-wide">Your Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">My Playlist</h1>
            <p className="text-lg text-white/90">
              {playlist.length} {playlist.length === 1 ? 'track' : 'tracks'} saved
            </p>
          </div>

          {playlist.length > 0 && (
            <div className="flex space-x-4">
              <button
                onClick={playPlaylist}
                className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                title="Play all"
              >
                <Play size={24} fill="currentColor" />
              </button>
              <button
                onClick={clearPlaylist}
                className="p-4 bg-red-500/80 backdrop-blur-sm rounded-full hover:bg-red-600 transition-colors"
                title="Clear playlist"
              >
                <Trash2 size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Playlist Tracks */}
      {playlist.length > 0 ? (
        <TrackList tracks={playlist} />
      ) : (
        <div className={cn(
          "text-center py-16 rounded-2xl",
          isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
        )}>
          <ListMusic size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Your playlist is empty
          </h2>
          <p className={cn(
            "text-lg",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Add tracks to your playlist by clicking the + button
          </p>
        </div>
      )}
    </div>
  );
}
