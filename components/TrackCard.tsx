'use client';

import { Play, Pause, Plus, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Track } from '@/lib/types';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useThemeStore } from '@/store/useThemeStore';
import { cn, formatTime } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  index?: number;
}

export default function TrackCard({ track, index }: TrackCardProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToPlaylist, playlist } = usePlayerStore();
  const { isDarkMode } = useThemeStore();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isInPlaylist = playlist.some(t => t.id === track.id);

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true); // Auto-play when new track selected
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToPlaylist(track);
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all hover:scale-[1.02]",
        isDarkMode ? "bg-gray-800/50 hover:bg-gray-800" : "bg-gray-100 hover:bg-gray-200",
        isCurrentTrack && "ring-2 ring-purple-500"
      )}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Index/Play Button */}
          <div className="flex-shrink-0 w-12 text-center">
            <button
              onClick={handlePlayPause}
              className="relative w-12 h-12"
            >
              {isCurrentTrack && isPlaying ? (
                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Pause size={20} className="text-white" fill="currentColor" />
                </div>
              ) : (
                <>
                  <span className={cn(
                    "group-hover:opacity-0 transition-opacity",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {index !== undefined ? index + 1 : ''}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Play size={20} className="text-white" fill="currentColor" />
                    </div>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Album Cover */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={track.album.cover_medium}
              alt={track.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/track/${track.id}`}
              className={cn(
                "font-semibold truncate block hover:underline",
                isDarkMode ? "text-white" : "text-gray-900",
                isCurrentTrack && "text-purple-500"
              )}
            >
              {track.title}
            </Link>
            <Link
              href={`/artist/${track.artist.id}`}
              className={cn(
                "text-sm truncate block hover:underline",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              {track.artist.name}
            </Link>
          </div>

          {/* Duration & Actions */}
          <div className="flex items-center space-x-4">
            <span className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {formatTime(track.duration)}
            </span>
            <button
              onClick={handleAddToPlaylist}
              className={cn(
                "p-2 rounded-full transition-colors",
                isInPlaylist
                  ? "bg-purple-500 text-white"
                  : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-300"
              )}
              title={isInPlaylist ? "In playlist" : "Add to playlist"}
            >
              {isInPlaylist ? <Check size={18} /> : <Plus size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
