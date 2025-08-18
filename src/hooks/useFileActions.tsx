import { useCallback } from "react"
import { useModalStore } from "@/store/modalStore"
import { useFileStore } from "@/store/fileStore"
import { RenameModal } from "@/components/modals/RenameModal"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { useEditorState } from "@/store/editorStore"
import { useClickDragStore } from "@/store/clickDragStore"
import { type FileItem, type FolderItem, type Item } from "@/types/fileSystem"

interface FileActionsConfig {
  showNotification?: (message: string, type: "success" | "error") => void
}

// show notification на будущий попап внизу справа
export const useFileActions = (config: FileActionsConfig = {}) => {
  const { showNotification } = config
  const { selectForMove } = useClickDragStore()
  const { openModal, closeModal } = useModalStore()
  const { items, addItem, updateItem, deleteItem } = useFileStore()
  const { setFile } = useEditorState()

  const handleRename = useCallback(
    async (item: Item) => {
      try {
        const newName = await new Promise<string | null>((resolve) => {
          openModal(
            <RenameModal
              type={item.type}
              initialName={item.name}
              onCancel={closeModal}
              onConfirm={(newName: string) => {
                resolve(newName)
                closeModal()
              }}
            />
          )
        })

        if (newName && newName !== item.name) {
          updateItem(item.id, { name: newName })
          showNotification?.(
            `"${item.name}" переименован в "${newName}"`,
            "success"
          )
        }
      } catch (error) {
        console.error("Ошибка переименования:", error)
        showNotification?.("Ошибка при переименовании", "error")
      }
    },
    [openModal, closeModal, updateItem, showNotification]
  )

  const handleDelete = useCallback(
    (item: Item) => {
      const confirmed = confirm(
        `Удалить ${item.type === "folder" ? "папку" : "файл"} "${item.name}"?`
      )
      if (!confirmed) return

      deleteItem(item.id)
      showNotification?.(`"${item.name}" удален`, "success")
    },
    [deleteItem, showNotification]
  )

  const handleDownload = useCallback(
    (item: Item) => {
      if (item.type !== "file") return

      try {
        const link = document.createElement("a")
        link.href = `#download-${item.id}` // TODO: заменить на реальный путь
        link.download = item.name
        link.click()

        showNotification?.(`Файл "${item.name}" скачан`, "success")
      } catch (error) {
        console.error("Ошибка скачивания:", error)
        showNotification?.("Ошибка при скачивании файла", "error")
      }
    },
    [showNotification]
  )

  const handleMove = useCallback(
    (item: Item) => {
      if (item.type === "file") {
        console.log(`Перемещение элемента с id: ${item.id}`)
        selectForMove({
          id: item.id,
          name: item.name,
          type: item.type
        })
      }
    },
    [selectForMove]
  )

  const handleShowInfo = useCallback((item: Item) => {
    alert(
      `Информация о:\nИмя: ${item.name}\nТип: ${item.type}\nID: ${item.id}\nРазмер: ${item.size ?? "—"}\nИзменён: ${item.modified ?? "—"}`
    )
  }, [])

  const handleCreate = useCallback(
    async (type: "file" | "folder", parentFolderId: number | null = null) => {
      const name = await new Promise<string | null>((resolve) => {
        openModal(
          <CreateItemModal
            type={type}
            onCancel={closeModal}
            onConfirm={(name: string) => {
              resolve(name)
              closeModal()
            }}
          />
        )
      })

      if (name) {
        const lastId = items[items.length - 1]?.id ?? 0
        let newItem

        if (type === "file") {
          newItem = {
            id: lastId + 1,
            name: name,
            type: type,
            folder: parentFolderId,
            size: "0b",
            modified: new Date().toISOString()
          }
        } else {
          newItem = {
            id: lastId + 1,
            name: name,
            type: type,
            size: "0b",
            modified: new Date().toISOString()
          }
        }

        addItem(newItem)

        if (type === "file") {
          setFile(newItem as FileItem)
        }
        showNotification?.(
          `${type === "folder" ? "Папка" : "Файл"} "${name}" создан`,
          "success"
        )
      }
    },
    [items, addItem, showNotification, openModal, closeModal]
  )

  return {
    handleRename,
    handleDelete,
    handleDownload,
    handleMove,
    handleShowInfo,
    handleCreate
  }
}
