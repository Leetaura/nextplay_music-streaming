"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deezerService } from "@/lib/deezer";
import { Album } from "@/lib/types";
import { useThemeStore } from "@/store/useThemeStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import TrackList from "@/components/TrackList";
import { Play, Calendar } from "lucide-react";

export default function AlbumPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeStore();
  const { setPlaylist, setCurrentTrack, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const data = await deezerService.getAlbum(id);
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const playAlbum = () => {
    if (album && album.tracks.data.length > 0) {
      setPlaylist(album.tracks.data);
      setCurrentTrack(album.tracks.data[0]);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={cn("h-96 rounded-3xl animate-pulse", isDarkMode ? "bg-gray-800" : "bg-gray-200")}></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Album not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Album Header */}
      <div className={cn("rounded-3xl overflow-hidden shadow-2xl", isDarkMode ? "bg-gray-800" : "bg-white")}>
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image src={album.cover_xl} alt={album.title} fill className="object-cover" />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className={cn("text-sm font-semibold uppercase tracking-wide", isDarkMode ? "text-purple-400" : "text-purple-600")}>Album</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2">{album.title}</h1>
            </div>

            <Link href={`/artist/${album.artist.id}`} className={cn("text-xl font-semibold hover:underline", isDarkMode ? "text-gray-300" : "text-gray-700")}>
              {album.artist.name}
            </Link>

            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-400" />
              <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>{album.tracks.data.length} tracks</span>
            </div>

            <button onClick={playAlbum} className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform font-semibold">
              <Play size={20} fill="currentColor" />
              <span>Play Album</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <section>
        <h2 className={cn("text-3xl font-bold mb-6", isDarkMode ? "text-white" : "text-gray-900")}>Tracks</h2>
        <TrackList tracks={album.tracks.data} />
      </section>
    </div>
  );
}
