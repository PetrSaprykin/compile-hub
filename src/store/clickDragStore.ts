// src/store/clickDragStore.ts
import { create } from "zustand"
import { useFileStore } from "./fileStore"

interface DragItem {
  id: number
  name: string
  type: "file"
}

interface ClickDragStore {
  selectedItem: DragItem | null
  isDragMode: boolean
  selectForMove: (item: DragItem) => void
  cancelMove: () => void
  moveToTarget: (targetId: number | null) => void
  isSelected: (itemId: number) => boolean
}

export const useClickDragStore = create<ClickDragStore>((set, get) => ({
  selectedItem: null,
  isDragMode: false,

  selectForMove: (item) => {
    console.log("Selecting for move:", item.name) // Для отладки
    set({ selectedItem: item, isDragMode: true })
  },

  cancelMove: () => {
    set({ selectedItem: null, isDragMode: false })
  },

  moveToTarget: (targetId) => {
    const { selectedItem } = get()
    if (!selectedItem) return

    // Более безопасный вызов moveFile
    try {
      useFileStore.getState().moveFile(selectedItem.id, targetId)
      set({ selectedItem: null, isDragMode: false })
    } catch (error) {
      console.error("Move failed:", error)
      set({ selectedItem: null, isDragMode: false })
    }
  },

  isSelected: (itemId) => get().selectedItem?.id === itemId
}))
