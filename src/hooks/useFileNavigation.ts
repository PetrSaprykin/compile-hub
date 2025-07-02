import { useState } from "react"
import { type FileItem } from "@/hooks/useFileActions"

export const useFileNavigation = (folders: FileItem[]) => {
  const [currentFolder, setCurrentFolder] = useState<number | null>(null)
  const [navigationHistory, setNavigationHistory] = useState<number[]>([])

  const goToFolder = (folderId: number) => {
    setNavigationHistory((prev) => [...prev, currentFolder ?? -1])
    setCurrentFolder(folderId)
  }

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previousFolder = navigationHistory[navigationHistory.length - 1]
      setCurrentFolder(previousFolder === -1 ? null : previousFolder)
      setNavigationHistory((prev) => prev.slice(0, -1))
    }
  }

  const getCurrentFolderName = () => {
    if (currentFolder === null) return "Главная"
    return folders.find((f) => f.id === currentFolder)?.name || "Неизвестная папка"
  }

  return {
    currentFolder,
    navigationHistory,
    goToFolder,
    goBack,
    getCurrentFolderName
  }
}
