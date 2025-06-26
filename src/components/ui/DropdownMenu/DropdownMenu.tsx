// src/components/ui/DropdownMenu/DropdownMenu.tsx
import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { IoEllipsisHorizontalCircle } from "react-icons/io5"
import styles from "./DropdownMenu.module.css"

interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
  separator?: boolean
  destructive?: boolean
}

interface DropdownMenuProps {
  items: MenuItem[]
  trigger?: React.ReactNode
  className?: string
  disabled?: boolean
  align?: "left" | "right" | "center"
  size?: "sm" | "md" | "lg"
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  trigger,
  className = "",
  disabled = false,
  align = "right",
  size = "md"
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // вычисляем позицию меню относительно триггера
  const calculatePosition = () => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const menuWidth = 180
    const menuHeight = items.length * 40

    let x = triggerRect.left
    let y = triggerRect.bottom + 4

    // выравнивание по горизонтали
    switch (align) {
      case "right":
        x = triggerRect.right - menuWidth
        break
      case "center":
        x = triggerRect.left + (triggerRect.width - menuWidth) / 2
        break
      default:
        x = triggerRect.left
        break
    }

    // проверяем границы экрана
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // корректируем по горизонтали
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 8
    }
    if (x < 8) {
      x = 8
    }

    // корректируем по вертикали
    if (y + menuHeight > viewportHeight) {
      y = triggerRect.top - menuHeight / 1.5
    }

    setPosition({ x, y })
  }

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        calculatePosition()
      }
      setIsOpen(!isOpen)
    }
  }

  // Пересчитываем позицию при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        calculatePosition()
      }
    }

    const handleResize = () => {
      if (isOpen) {
        calculatePosition()
      }
    }

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true)
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("scroll", handleScroll, true)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [isOpen])

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen])

  const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!item.disabled && !item.separator) {
      item.onClick()
      setIsOpen(false)
    }
  }

  const getTriggerSize = () => {
    switch (size) {
      case "sm":
        return 20
      case "md":
        return 24
      case "lg":
        return 28
      default:
        return 24
    }
  }

  const defaultTrigger = <IoEllipsisHorizontalCircle size={getTriggerSize()} />

  // Меню в портале
  const menu = isOpen ? (
    <div
      ref={menuRef}
      className={styles.portalMenu}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        background: "var(--bg-color)",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        width: "180px",
        padding: "4px 0",
        animation: "slideIn 0.15s ease-out"
      }}
      role='menu'
      aria-orientation='vertical'
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {item.separator ? (
            <div className={styles.separator} role='separator' />
          ) : (
            <button
              className={`${styles.item} ${item.disabled ? styles.disabled : ""} ${item.destructive ? styles.destructive : ""}`}
              onClick={(e) => handleItemClick(item, e)}
              disabled={item.disabled}
              role='menuitem'
              tabIndex={-1}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  ) : null

  return (
    <>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${disabled ? styles.disabled : ""} ${className}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        aria-label='Открыть меню действий'
      >
        {trigger || defaultTrigger}
      </button>

      {/* Рендерим меню в портал - это решает проблему с overflow */}
      {menu && createPortal(menu, document.body)}
    </>
  )
}

export type { MenuItem, DropdownMenuProps }
