import { create } from 'zustand';

export interface SelectedAlbumWithMeta {
  id: number;
  title: string;
  performer: string;
  nbTracks: number;
  duration: string;
  cover: string;
  releaseDate: string;
}

interface SelectedAlbumState {
  album: SelectedAlbumWithMeta;
  setSelectedAlbum: (newAlbum: SelectedAlbumWithMeta) => void;
  clearSelectedAlbum: () => void;
}

export const useSelectedAlbumStore = create<SelectedAlbumState>((set) => ({
  album: {
    id: 0,
    title: '',
    performer: '',
    nbTracks: 0,
    duration: '',
    cover: '',
    releaseDate: '',
  },
  setSelectedAlbum: (newAlbum) => {
    set({ album: newAlbum });
  },
  clearSelectedAlbum: () => {
    set({ album: {
      id: 0,
      title: '',
      performer: '',
      nbTracks: 0,
      duration: '',
      cover: '',
      releaseDate: '',
    } });
  },
}));

