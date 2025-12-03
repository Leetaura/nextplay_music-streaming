"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deezerService } from "@/lib/deezer";
import { Track } from "@/lib/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Play, Plus, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatTime } from "@/lib/utils";

export default function TrackPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeStore();
  const { setCurrentTrack, setIsPlaying, addToPlaylist, playlist } = usePlayerStore();

  const isInPlaylist = playlist.some((t) => t.id === id);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const data = await deezerService.getTrack(id);
        setTrack(data);
      } catch (error) {
        console.error("Error fetching track:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={cn("h-96 rounded-3xl animate-pulse", isDarkMode ? "bg-gray-800" : "bg-gray-200")}></div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Track not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={cn("rounded-3xl overflow-hidden shadow-2xl", isDarkMode ? "bg-gray-800" : "bg-white")}>
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Album Cover */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image src={track.album.cover_xl} alt={track.title} fill className="object-cover" />
          </div>

          {/* Track Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className={cn("text-sm font-semibold uppercase tracking-wide", isDarkMode ? "text-purple-400" : "text-purple-600")}>Track</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2">{track.title}</h1>
            </div>

            <div className="space-y-2">
              <Link href={`/artist/${track.artist.id}`} className={cn("text-xl font-semibold hover:underline", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                {track.artist.name}
              </Link>
              <br />
              <Link href={`/album/${track.album.id}`} className={cn("text-lg hover:underline", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                {track.album.title}
              </Link>
            </div>

            <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>Duration: {formatTime(track.duration)}</div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                className="flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform font-semibold"
              >
                <Play size={20} fill="currentColor" />
                <span>Play Preview</span>
              </button>

              <button
                onClick={() => addToPlaylist(track)}
                className={cn(
                  "flex items-center space-x-2 px-8 py-4 rounded-full font-semibold transition-all",
                  isInPlaylist ? "bg-purple-500 text-white" : isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                )}
              >
                {isInPlaylist ? <Check size={20} /> : <Plus size={20} />}
                <span>{isInPlaylist ? "In Playlist" : "Add to Playlist"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
