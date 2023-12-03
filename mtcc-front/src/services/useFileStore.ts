import { create } from 'zustand';

interface FileWithMeta {
  file: File;
  name: string;
  size: number;
  preview: string;
}

interface FileState {
  files: FileWithMeta[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (fileIndex: number) => void;
  resetFiles: () => void;
}

export const useHomeFileStore = create<FileState>((set) => ({
  files: [],
  addFiles: (newFiles) => set((state) => ({
    files: [
      ...state.files,
      ...newFiles
        .filter(newFile => !state.files.some(fileWithMeta => fileWithMeta.name === newFile.name))
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        })),
    ],
  })),
  removeFile: (fileIndex) => set((state) => ({
    files: state.files.filter((_, index) => index !== fileIndex),
  })),
  resetFiles: () => set({ files: [] }),
}));

export const useNfoFileStore = create<FileState>((set) => ({
  files: [],
  addFiles: (newFiles) => set((state) => ({
    files: [
      ...state.files,
      ...newFiles
        .filter(newFile => !state.files.some(fileWithMeta => fileWithMeta.name === newFile.name))
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        })),
    ],
  })),
  removeFile: (fileIndex) => set((state) => ({
    files: state.files.filter((_, index) => index !== fileIndex),
  })),
  resetFiles: () => set({ files: [] }),
}));
