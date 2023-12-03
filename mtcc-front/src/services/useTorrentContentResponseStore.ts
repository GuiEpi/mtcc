import { create } from 'zustand';

export interface TorrentContentResponse {
    nfoDownloadLink: string;
    torrentName: string;
    pres: string;
    nfo: string;
}

export interface NfoContentResponse {
    nfoDownloadLink: string;
    nfo: string;
}

export interface PresContentResponse {
    torrentName: string;
    pres: string;
}
  
interface TorrentContentResponseState {
    torrentContent: Partial<TorrentContentResponse>;
    setTorrentContentResponse: (response: TorrentContentResponse) => void;
    resetTorrentContentResponse: () => void;
}

interface NfoContentResponseState {
    nfoContent: Partial<NfoContentResponse>;
    setNfoContentResponse: (response: NfoContentResponse) => void;
    resetNfoContentResponse: () => void;
}

interface PresContentResponseState {
    presContent: Partial<PresContentResponse>;
    setPresContentResponse: (response: PresContentResponse) => void;
    resetPresContentResponse: () => void;
}

export const useTorrentContentResponseStore = create<TorrentContentResponseState>((set) => ({
    torrentContent: {},
    setTorrentContentResponse: (response) => set({ torrentContent: response }),
    resetTorrentContentResponse: () => {
        set({ torrentContent: {}})
    },
}));

export const useNfoContentResponseStore = create<NfoContentResponseState>((set) => ({
    nfoContent: {},
    setNfoContentResponse: (response) => set({ nfoContent: response }),
    resetNfoContentResponse: () => {
        set({ nfoContent: {}})
    },
}));

export const usePresContentResponseStore = create<PresContentResponseState>((set) => ({
    presContent: {},
    setPresContentResponse: (response) => set({ presContent: response }),
    resetPresContentResponse: () => {
        set({ presContent: {}})
    },
}));
