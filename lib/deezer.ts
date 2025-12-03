import axios from 'axios';
import { Track, Artist, Album, SearchResult } from '@/lib/types';

// Use our own Next.js API route as proxy
const API_BASE = '/api/deezer';

const api = axios.create({
  timeout: 15000,
});

// Make request through our Next.js API route
const makeRequest = async (endpoint: string): Promise<unknown> => {
  try {
    const url = `${API_BASE}?endpoint=${encodeURIComponent(endpoint)}`;
    console.log('Requesting:', url);
    
    const response = await api.get(url);
    console.log('Request successful');
    return response.data;
  } catch (error) {
    const err = error as { response?: { status?: number; data?: unknown }; message?: string };
    console.error('Request failed:', err.response?.status || err.message);
    throw error;
  }
};

export const deezerService = {
  search: async (query: string, limit = 20): Promise<SearchResult> => {
    try {
      const data = await makeRequest(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return data as SearchResult;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  getTrack: async (id: number): Promise<Track> => {
    try {
      const data = await makeRequest(`/track/${id}`);
      return data as Track;
    } catch (error) {
      console.error('Get track error:', error);
      throw error;
    }
  },

  getArtist: async (id: number): Promise<Artist> => {
    try {
      const data = await makeRequest(`/artist/${id}`);
      return data as Artist;
    } catch (error) {
      console.error('Get artist error:', error);
      throw error;
    }
  },

  getArtistTopTracks: async (id: number, limit = 10) => {
    try {
      const data = await makeRequest(`/artist/${id}/top?limit=${limit}`);
      return data;
    } catch (error) {
      console.error('Get artist top tracks error:', error);
      throw error;
    }
  },

  getAlbum: async (id: number): Promise<Album> => {
    try {
      const data = await makeRequest(`/album/${id}`);
      return data as Album;
    } catch (error) {
      console.error('Get album error:', error);
      throw error;
    }
  },

  getChart: async (limit = 20) => {
    try {
      const data = await makeRequest(`/chart/0/tracks?limit=${limit}`);
      return data;
    } catch (error) {
      console.error('Get chart error:', error);
      throw error;
    }
  },
};
