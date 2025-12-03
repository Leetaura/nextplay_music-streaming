"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useThemeStore } from "@/store/useThemeStore";
import { formatTime, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function FooterPlayer() {
  const { currentTrack, isPlaying, progress, volume, duration, setIsPlaying, setProgress, setVolume, setDuration, playNext, playPrevious } = usePlayerStore();

  const { isDarkMode } = useThemeStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Load track when changed
  useEffect(() => {
    if (!currentTrack || !currentTrack.preview) return;

    const audio = audioRef.current;
    if (audio) {
      audio.src = currentTrack.preview;
      audio.load();
    }
  }, [currentTrack]);

  // Handle play/pause separately
  useEffect(() => {
    if (!currentTrack) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name === "AbortError") return;
          console.error("Playback error:", error.name);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Deezer Audio Player */}
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded} style={{ display: "none" }} preload="none" />

      <div className={cn("fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-colors", isDarkMode ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-200")}>
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Track Info */}
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-lg">
                <Image src={currentTrack.album.cover_medium} alt={currentTrack.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/track/${currentTrack.id}`} className={cn("font-semibold truncate block hover:underline", isDarkMode ? "text-white" : "text-gray-900")}>
                  {currentTrack.title}
                </Link>
                <Link href={`/artist/${currentTrack.artist.id}`} className={cn("text-sm truncate block hover:underline", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  {currentTrack.artist.name}
                </Link>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-4">
                <button onClick={playPrevious} className={cn("p-2 rounded-full transition-colors", isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                  <SkipBack size={20} />
                </button>

                <button onClick={handlePlayPause} className="p-3 rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <button onClick={playNext} className={cn("p-2 rounded-full transition-colors", isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                  <SkipForward size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-600")}>{formatTime(progress)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={progress}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
                <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-600")}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume & Actions */}
            <div className="flex items-center justify-end space-x-2">
              <button onClick={toggleMute} className={cn("p-2 rounded-full transition-colors", isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
              />
              <button
                onClick={() => setShowVisualizer(!showVisualizer)}
                className={cn("p-2 rounded-full transition-colors", showVisualizer && "bg-purple-500 text-white", isDarkMode && !showVisualizer && "hover:bg-gray-800", !isDarkMode && !showVisualizer && "hover:bg-gray-100")}
              >
                <ListMusic size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
