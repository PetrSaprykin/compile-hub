import { useMemo } from "react"
import { type FileItem } from "@/hooks/useFileActions"

export const useFileFilter = (
  folders: FileItem[],
  files: FileItem[],
  currentFolder: number | null,
  searchText: string
) => {
  return useMemo(() => {
    // Получаем базовые элементы
    let items =
      currentFolder === null ? [...folders] : files.filter((file) => file.folder === currentFolder)

    // Применяем поиск
    if (searchText) {
      items = items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    }

    // Сортируем
    return items.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1
      if (a.type !== "folder" && b.type === "folder") return 1
      return 0
    })
  }, [folders, files, currentFolder, searchText])
}
