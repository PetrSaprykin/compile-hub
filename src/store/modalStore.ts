import { create } from "zustand"

type ModalStore = {
  isOpen: boolean
  isLocked: boolean
  content: React.ReactNode | null
  extraClass?: string
  openModal: (content: React.ReactNode, extraClass: string) => void
  setIsLocked: (state: boolean) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set, get) => ({
  isOpen: false,
  isLocked: false,
  content: null,
  extraClass: "",
  openModal: (content, extraClassName) =>
    set({ isOpen: true, content: content, extraClass: extraClassName }),
  setIsLocked: (state) => {
    set({ isLocked: state })
  },
  closeModal: () => {
    if (!get().isLocked) {
      set({ isOpen: false, content: null, extraClass: "", isLocked: false })
    }
  }
}))
