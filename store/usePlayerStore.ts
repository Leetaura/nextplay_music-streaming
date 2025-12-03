import { create } from 'zustand';
import { Track, PlayerState } from '@/lib/types';
import { persist } from 'zustand/middleware';

interface PlayerStore extends PlayerState {
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  setDuration: (duration: number) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToRecentlyPlayed: (track: Track) => void;
  clearPlaylist: () => void;
  setPlaylist: (tracks: Track[]) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      volume: 0.7,
      duration: 0,
      playlist: [],
      currentIndex: -1,
      recentlyPlayed: [],

      setCurrentTrack: (track) => {
        const { playlist, addToRecentlyPlayed } = get();
        const currentIndex = playlist.findIndex((t) => t.id === track.id);
        addToRecentlyPlayed(track);
        set({ 
          currentTrack: track, 
          isPlaying: true,
          currentIndex: currentIndex !== -1 ? currentIndex : -1
        });
      },

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      
      setProgress: (progress) => set({ progress }),
      
      setVolume: (volume) => set({ volume }),
      
      setDuration: (duration) => set({ duration }),

      addToPlaylist: (track) => {
        const { playlist } = get();
        if (!playlist.find((t) => t.id === track.id)) {
          set({ playlist: [...playlist, track] });
        }
      },

      removeFromPlaylist: (trackId) => {
        const { playlist } = get();
        set({ playlist: playlist.filter((t) => t.id !== trackId) });
      },

      playNext: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length === 0) return;
        
        const nextIndex = (currentIndex + 1) % playlist.length;
        set({ 
          currentTrack: playlist[nextIndex], 
          currentIndex: nextIndex,
          isPlaying: true,
          progress: 0
        });
      },

      playPrevious: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length === 0) return;
        
        const prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
        set({ 
          currentTrack: playlist[prevIndex], 
          currentIndex: prevIndex,
          isPlaying: true,
          progress: 0
        });
      },

      addToRecentlyPlayed: (track) => {
        const { recentlyPlayed } = get();
        const filtered = recentlyPlayed.filter((t) => t.id !== track.id);
        set({ 
          recentlyPlayed: [track, ...filtered].slice(0, 10)
        });
      },

      clearPlaylist: () => set({ playlist: [], currentIndex: -1 }),

      setPlaylist: (tracks) => set({ playlist: tracks }),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({ 
        playlist: state.playlist,
        recentlyPlayed: state.recentlyPlayed,
        volume: state.volume
      }),
    }
  )
);
