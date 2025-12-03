export interface Track {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: {
    id: number;
    name: string;
    picture_medium: string;
  };
  album: {
    id: number;
    title: string;
    cover_medium: string;
    cover_xl: string;
  };
}

export interface Artist {
  id: number;
  name: string;
  picture_medium: string;
  picture_xl: string;
  nb_fan: number;
}

export interface Album {
  id: number;
  title: string;
  cover_medium: string;
  cover_xl: string;
  artist: {
    id: number;
    name: string;
  };
  tracks: {
    data: Track[];
  };
}

export interface SearchResult {
  data: Track[];
  total: number;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
  recentlyPlayed: Track[];
}
