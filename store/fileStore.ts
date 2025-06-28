import { create } from "zustand";

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  type: "pdf" | "text";
  uploadedAt: Date;
}

interface FileStore {
  uploadedFiles: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  getFileContent: () => string;
}

export const useFileStore = create<FileStore>((set, get) => ({
  uploadedFiles: [],

  addFile: (file) => {
    set((state) => ({
      uploadedFiles: [...state.uploadedFiles, file],
    }));
  },

  removeFile: (id) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
    }));
  },

  clearFiles: () => {
    set({ uploadedFiles: [] });
  },

  getFileContent: () => {
    const { uploadedFiles } = get();
    return uploadedFiles.map((file) => file.content).join("\n\n");
  },
}));
