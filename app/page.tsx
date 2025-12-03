"use client";

import { useEffect, useState } from "react";
import { deezerService } from "@/lib/deezer";
import { Track } from "@/lib/types";
import TrackList from "@/components/TrackList";
import { useThemeStore } from "@/store/useThemeStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Sparkles, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [popularTracks, setPopularTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeStore();
  const { recentlyPlayed } = usePlayerStore();

  useEffect(() => {
    const fetchPopularTracks = async () => {
      try {
        const data = await deezerService.getChart(20);
        setPopularTracks((data as { data: Track[] }).data);
      } catch (error) {
        console.error("Error fetching popular tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTracks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className={cn("rounded-3xl p-8 md:p-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl", "relative overflow-hidden")}>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="animate-pulse" size={24} />
            <span className="text-sm font-semibold uppercase tracking-wide">Welcome to NextPlay</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Amazing Music</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">Stream millions of songs, create playlists, and enjoy high-quality music previews powered by Deezer.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="text-purple-500" size={28} />
            <h2 className={cn("text-3xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Recently Played</h2>
          </div>
          <TrackList tracks={recentlyPlayed.slice(0, 5)} />
        </section>
      )}

      {/* Popular Tracks */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="text-pink-500" size={28} />
          <h2 className={cn("text-3xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Trending Now</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={cn("h-24 rounded-xl animate-pulse", isDarkMode ? "bg-gray-800" : "bg-gray-200")}></div>
            ))}
          </div>
        ) : (
          <TrackList tracks={popularTracks} />
        )}
      </section>
    </div>
  );
}
