import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  content: React.ReactNode | null;
  extraClass?: string;
  openModal: (content: React.ReactNode, extraClass: string) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  content: null,
  extraClass: "",
  openModal: (content, extraClassName) => set({ isOpen: true, content, extraClass: extraClassName }),
  closeModal: () => set({ isOpen: false, content: null, extraClass: "" }),
}));