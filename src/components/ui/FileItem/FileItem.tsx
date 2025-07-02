// Обновленный FileItem с использованием useFileActions

import React from "react"
import {
  DropdownMenu,
  type MenuItem
} from "@/components/ui/DropdownMenu/DropdownMenu"
import { useFileActions } from "@/hooks/useFileActions"
import styles from "./FileItem.module.css"

interface FileItemProps {
  id: number
  name: string
  type: "file" | "folder"
  folder?: number | null
  size?: string
  modified?: string
  className?: string
  fileListRef?: React.RefObject<HTMLDivElement>
  onClick?: () => void

  // Drag & drop пропсы
  isSelected?: boolean
  isDragMode?: boolean
  canDropHere?: boolean
  onSelectForMove?: () => void
  onDropHere?: () => void
}

export const FileItem: React.FC<FileItemProps> = ({
  id,
  name,
  type,
  folder,
  size,
  modified,
  className = "",
  onClick,
  isSelected = false,
  isDragMode = false,
  canDropHere = false,
  onSelectForMove,
  onDropHere
}) => {
  // Инициализируем хук действий
  const {
    handleRename,
    handleDelete,
    handleDownload,
    handleMove,
    handleShowInfo
  } = useFileActions({
    onMove: () => onSelectForMove?.(),
    showNotification: (message, type) => {
      console.log(`${type.toUpperCase()}: ${message}`)
      // TODO: Здесь можно добавить настоящие уведомления
    }
  })

  const currentFile = { id, name, size, modified, type, folder }

  const handleClick = (): void => {
    if (isDragMode && canDropHere) {
      onDropHere?.()
    } else if (!isDragMode) {
      onClick?.()
    }
  }

  // Генерируем меню на основе типа файла
  const getMenuItems = (): MenuItem[] => {
    if (isDragMode) return []

    const menuItems: MenuItem[] = [
      {
        id: "rename",
        label: "Переименовать",
        icon: "✏️",
        onClick: () => handleRename(currentFile)
      }
    ]

    // Действия только для файлов
    if (type === "file") {
      menuItems.push(
        {
          id: "download",
          label: "Скачать",
          icon: "⬇️",
          onClick: () => handleDownload(currentFile)
        },
        {
          id: "move",
          label: "Переместить",
          icon: "➡️",
          onClick: () => handleMove(currentFile)
        }
      )
    }

    // Общие действия
    menuItems.push(
      {
        id: "separator1",
        label: "",
        icon: "",
        separator: true,
        onClick: () => {}
      },
      {
        id: "delete",
        label: "Удалить",
        icon: "🗑️",
        onClick: () => handleDelete(currentFile),
        destructive: true
      },

      {
        id: "separator2",
        label: "",
        icon: "",
        separator: true,
        onClick: () => {}
      },
      {
        id: "info",
        label: "Свойства",
        icon: "ℹ️",
        onClick: () => handleShowInfo(currentFile)
      }
    )

    return menuItems
  }

  const itemClasses: string = [
    styles.fileItem,
    className,
    isSelected && styles.selected,
    isDragMode && canDropHere && styles.dropTarget,
    isDragMode && !canDropHere && !isSelected && styles.disabled
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={itemClasses} onClick={handleClick}>
      {/* Иконка */}
      <span className={styles.icon}>{type === "folder" ? "📁" : "📄"}</span>

      {/* Информация */}
      <div className={styles.fileInfo}>
        <div className={styles.fileName}>{name}</div>
        {(size || modified) && (
          <div className={styles.additionalInfo}>
            {size && <span>{size}</span>}
            {size && modified && <span> • </span>}
            {modified && <span>{modified}</span>}
          </div>
        )}
      </div>

      {/* Индикаторы состояния */}
      {isSelected && <div className={styles.selectedBadge}>✂️</div>}

      {isDragMode && canDropHere && (
        <div className={styles.dropHint}>Move here</div>
      )}

      {/* Dropdown menu */}
      {!isDragMode && (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <DropdownMenu items={getMenuItems()} align='left' size='md' />
        </div>
      )}
    </div>
  )
}
