// src/hooks/useClickDrag.ts
import { useState, useCallback } from "react"

interface DragItem {
  id: number
  name: string
  type: "file" | "folder"
}

export const useClickDrag = () => {
  const [selectedItem, setSelectedItem] = useState<DragItem | null>(null)

  const selectForMove = useCallback((item: DragItem) => {
    setSelectedItem(item)
  }, [])

  const moveToTarget = useCallback(
    (targetId: number | null, onMove: (itemId: number, targetId: number | null) => void) => {
      if (selectedItem) {
        onMove(selectedItem.id, targetId)
        setSelectedItem(null)
      }
    },
    [selectedItem]
  )

  const cancelMove = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const isSelected = useCallback(
    (itemId: number) => {
      return selectedItem?.id === itemId
    },
    [selectedItem]
  )

  const canDropHere = useCallback(
    (itemType: "file" | "folder"): boolean => {
      // Можно перемещать в папки, но не в тот же элемент
      return !!(selectedItem && itemType === "folder")
    },
    [selectedItem]
  )

  return {
    selectedItem,
    isDragMode: !!selectedItem,
    selectForMove,
    moveToTarget,
    cancelMove,
    isSelected,
    canDropHere
  }
}
