import { useCallback } from "react"
import { useModalStore } from "@/store/modalStore"
import { RenameModal } from "@/components/ui/Modal"

export interface FileItem {
  id: number
  name: string
  size?: string
  modified?: string
  type: "file" | "folder"
  folder?: number | null
}

interface FileActionsConfig {
  onMove?: (fileId: number) => void
  onFileUpdate?: (files: FileItem[]) => void
  showNotification?: (message: string, type: "success" | "error") => void
}

export const useFileActions = (config: FileActionsConfig = {}) => {
  const { onMove, onFileUpdate, showNotification } = config
  const { openModal, closeModal } = useModalStore()

  // переименование файла
  const handleRename = useCallback(async (file: FileItem) => {
    try {
      const newName = await new Promise<string | null>((resolve) => {
        openModal(
          <RenameModal
            type={file.type}
            initialName={file.name}
            onCancel={closeModal}
            onConfirm={(newName: string) => {
              resolve(newName)
              closeModal()
              return
            }}
          />
        )
      })

      if (newName) {
        // TODO: Здесь будет API вызов
        console.log("Переименовано, новое имя: " + newName)
      }
    } catch (error) {
      console.error("Ошибка переименования:", error)
      // можно будет добавить уведомление об ошибке в popup
    }
  }, [])

  // Удаление
  const handleDelete = useCallback(
    async (file: FileItem) => {
      try {
        const confirmed = confirm(
          `Удалить ${file.type === "folder" ? "папку" : "файл"} "${file.name}"?`
        )
        if (!confirmed) return

        // TODO: Здесь будет API вызов
        console.log(`Удаление ${file.name}`)

        showNotification?.(
          `${file.type === "folder" ? "Папка" : "Файл"} "${file.name}" удален`,
          "success"
        )
      } catch (error) {
        console.error("Ошибка удаления:", error)
        showNotification?.("Ошибка при удалении", "error")
      }
    },
    [showNotification]
  )

  // Скачивание (только для файлов)
  const handleDownload = useCallback(
    async (file: FileItem) => {
      if (file.type !== "file") return

      try {
        // TODO: Здесь будет логика скачивания
        console.log(`Скачивание ${file.name}`)

        // Имитация скачивания
        const link = document.createElement("a")
        link.href = `#download-${file.id}` // В реальности тут будет URL файла
        link.download = file.name
        link.click()

        showNotification?.(`Файл "${file.name}" скачан`, "success")
      } catch (error) {
        console.error("Ошибка скачивания:", error)
        showNotification?.("Ошибка при скачивании файла", "error")
      }
    },
    [showNotification]
  )

  // перемещение
  const handleMove = useCallback(
    (file: FileItem) => {
      console.log(`Начинаем перемещение ${file.name}`)
      onMove?.(file.id)
    },
    [onMove]
  )

  // Показать свойства
  const handleShowInfo = useCallback((file: FileItem) => {
    console.log(`Показ информации о ${file.name}`)
    // TODO: Открыть модальное окно с информацией о файле
    alert(
      `Информация о файле:\nИмя: ${file.name}\nТип: ${file.type}\nID: ${file.id}`
    )
  }, [])

  return {
    handleRename,
    handleDelete,
    handleDownload,
    handleMove,
    handleShowInfo
  }
}
