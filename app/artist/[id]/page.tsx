"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deezerService } from "@/lib/deezer";
import { Artist, Track } from "@/lib/types";
import { useThemeStore } from "@/store/useThemeStore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import TrackList from "@/components/TrackList";
import { Users } from "lucide-react";

export default function ArtistPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const [artistData, tracksData] = await Promise.all([deezerService.getArtist(id), deezerService.getArtistTopTracks(id, 10)]);
        setArtist(artistData);
        setTopTracks((tracksData as { data: Track[] }).data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={cn("h-96 rounded-3xl animate-pulse", isDarkMode ? "bg-gray-800" : "bg-gray-200")}></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Artist not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Artist Header */}
      <div className={cn("rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12", "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500")}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl flex-shrink-0">
            <Image src={artist.picture_xl} alt={artist.name} fill className="object-cover" />
          </div>

          <div className="text-white text-center md:text-left space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wide">Artist</span>
            <h1 className="text-5xl md:text-6xl font-bold">{artist.name}</h1>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-lg">
              <Users size={20} />
              <span>{artist.nb_fan?.toLocaleString()} fans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <section>
        <h2 className={cn("text-3xl font-bold mb-6", isDarkMode ? "text-white" : "text-gray-900")}>Top Tracks</h2>
        <TrackList tracks={topTracks} />
      </section>
    </div>
  );
}
