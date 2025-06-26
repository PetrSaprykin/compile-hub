// src/components/FileExplorer/FileItem.tsx
import React from "react"
import {
  DropdownMenu,
  type MenuItem
} from "@/components/ui/DropdownMenu/DropdownMenu"
import styles from "./FileItem.module.css"

interface FileItemProps {
  name: string
  type: "file" | "folder"
  size?: string
  modified?: string
  className?: string
}

export const FileItem: React.FC<FileItemProps> = ({
  name,
  type,
  size,
  modified,
  className = ""
}) => {
  const handleAction = (action: string) => {
    console.log(`${action} для ${type}: ${name}`)
    // Здесь ваша логика для каждого действия
  }

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        id: "copy",
        label: "Копировать",
        icon: "📋",
        onClick: () => handleAction("copy")
      },
      {
        id: "rename",
        label: "Переименовать",
        icon: "✏️",
        onClick: () => handleAction("rename"),
        separator: false, // явно добавил т.к иначе ts почему-то ругается на отсутствие этих пропсов в items.push
        destructive: false // явно добавил т.к иначе ts почему-то ругается на отсутствие этих пропсов в items.push
      }
    ]

    // Для файлов добавляем дополнительные опции
    if (type === "file") {
      items.push(
        {
          id: "download",
          label: "Скачать",
          icon: "⬇️",
          onClick: () => handleAction("download")
        },
        {
          id: "share",
          label: "Поделиться",
          icon: "📤",
          onClick: () => handleAction("share")
        }
      )
    }

    items.push(
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
        onClick: () => handleAction("delete"),
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
        onClick: () => handleAction("info")
      }
    )

    return items
  }

  return (
    <div className={`${styles.fileItem} ${className}`}>
      {/* Иконка файла/папки */}
      <span className={styles.icon}>{type === "folder" ? "📁" : "📄"}</span>

      {/* Информация о файле */}
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

      <DropdownMenu items={getMenuItems()} align='left' size='md' />
    </div>
  )
}
