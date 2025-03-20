// src/store/fileStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface FileState {
  id: string;
  file: File;
  progress: number;
  converted: boolean;
  error: string | null;
}

interface FileStore {
  files: FileState[];
  converting: boolean;
  addFiles: (files: File[]) => void;
  updateFileProgress: (id: string, progress: number) => void;
  setConverting: (converting: boolean) => void;
  clearFiles: () => void;
  setFileError: (id: string, error: string) => void;
}

export const useFileStore = create<FileStore>(set => ({
  files: [],
  converting: false,
  addFiles: files =>
    set(state => ({
      files: [
        ...state.files,
        ...files.map(file => ({
          id: uuidv4(),
          file,
          progress: 0,
          converted: false,
          error: null,
        })),
      ],
    })),
  updateFileProgress: (id, progress) =>
    set(state => ({
      files: state.files.map(file => (file.id === id ? { ...file, progress } : file)),
    })),
  setConverting: converting => set({ converting }),
  clearFiles: () => set({ files: [] }),
  setFileError: (id, error) =>
    set(state => ({
      files: state.files.map(file => (file.id === id ? { ...file, error } : file)),
    })),
}));
