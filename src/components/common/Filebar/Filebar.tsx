// УПРОЩЕННАЯ ВЕРСИЯ Filebar компонента

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import styles from "./Filebar.module.css"
import { FileItem, type FileItemProps } from "@/components/ui/FileItem"
import { useClickDrag } from "@/hooks/useClickDrag"
import { useFileNavigation } from "@/hooks/useFileNavigation"
import { useMockData } from "@/hooks/useMockData"
import { MdSearch, MdChevronRight, MdChevronLeft } from "react-icons/md"
import { useRef, useState } from "react"
import { IoArrowBack } from "react-icons/io5"

export const Filebar = () => {
  const [isFilebarOpen, setFilebarOpen] = useState(true)
  const [searchText, setSearchText] = useState("")
  const fileListRef = useRef<HTMLDivElement>(null!)

  // Выносим данные в отдельный хук
  const { folders, files, moveFile } = useMockData()

  // Выносим навигацию в отдельный хук
  const {
    currentFolder,
    navigationHistory,
    goToFolder,
    goBack,
    getCurrentFolderName
  } = useFileNavigation(folders)

  // Drag & drop остается как есть
  const {
    selectedItem,
    isDragMode,
    selectForMove,
    moveToTarget,
    cancelMove,
    isSelected,
    canDropHere
  } = useClickDrag()

  // УПРОЩЕННАЯ функция перемещения
  const handleMoveItem = (itemId: number, targetId: number | null) => {
    moveFile(itemId, targetId)
    console.log(`Файл ${selectedItem?.name} перемещен`)
  }

  // УПРОЩЕННАЯ функция фильтрации
  const getVisibleItems = () => {
    // Получаем элементы для текущей папки
    let items =
      currentFolder === null
        ? [
            ...folders,
            ...files.filter((file: FileItemProps) => file.folder === null)
          ]
        : files.filter((file: FileItemProps) => file.folder === currentFolder)

    // Применяем поиск
    if (searchText) {
      items = items.filter((item: FileItemProps) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // Сортируем: папки сверху
    return items.sort((a: FileItemProps, b: FileItemProps) => {
      if (a.type === "folder" && b.type !== "folder") return -1
      if (a.type !== "folder" && b.type === "folder") return 1
      return 0
    })
  }

  // УПРОЩЕННЫЕ обработчики
  const handleFolderClick = (folderId: number) => {
    if (isDragMode) {
      moveToTarget(folderId, handleMoveItem)
    } else {
      goToFolder(folderId)
    }
  }

  const handleMoveToRoot = () => moveToTarget(null, handleMoveItem)
  const handleBackClick = () => {
    goBack()
    cancelMove()
  }

  const visibleItems = getVisibleItems()

  return (
    <div
      className={`${styles.filebar} ${!isFilebarOpen ? styles.hiddenFilebar : ""}`}
    >
      <div className={styles.filebarContainer}>
        {/* Поиск */}
        <Input
          icon={<MdSearch />}
          placeholder='Поиск файлов...'
          className={styles.search}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <hr />

        {/* Навигация */}
        <div className={styles.navigation}>
          {!isDragMode ? (
            // Обычная навигация
            <>
              <button
                onClick={handleBackClick}
                disabled={navigationHistory.length === 0}
                className={styles.backButton}
              >
                <IoArrowBack size={20} />
              </button>
              <span className={styles.currentPath}>
                {getCurrentFolderName()}
              </span>
            </>
          ) : (
            // Режим перетаскивания
            <div className={styles.moveActionsButtons}>
              <button
                onClick={handleMoveToRoot}
                className={`${styles.moveToRootButton} ${styles.actionButton}`}
              >
                Move to home
              </button>
              <button
                onClick={cancelMove}
                className={`${styles.cancelButton} ${styles.actionButton}`}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <hr />

        {/* Список файлов */}
        <div
          className={`${styles.fileList} ${isDragMode ? styles.dragMode : ""}`}
          ref={fileListRef}
        >
          {visibleItems.length > 0 ? (
            visibleItems.map((item: FileItemProps) => (
              <FileItem
                key={item.id}
                {...item}
                onClick={() =>
                  item.type === "folder" && handleFolderClick(item.id)
                }
                fileListRef={fileListRef}
                // Drag & drop пропсы
                isSelected={isSelected(item.id)}
                isDragMode={isDragMode}
                canDropHere={canDropHere(item.type, item.id)}
                onSelectForMove={() =>
                  selectForMove({
                    id: item.id,
                    name: item.name,
                    type: item.type
                  })
                }
                onDropHere={() => moveToTarget(item.id, handleMoveItem)}
              />
            ))
          ) : (
            <span className={styles.searchError}>
              {searchText ? `Файл "${searchText}" не найден` : "Папка пуста"}
            </span>
          )}
        </div>

        <hr />

        {/* Кнопки создания */}
        <div className={styles.buttons}>
          <Button variant='secondary'>New file</Button>
          <Button variant='secondary'>New folder</Button>
        </div>
      </div>

      {/* Переключатель */}
      <button
        className={styles.openMenuButton}
        onClick={() => setFilebarOpen(!isFilebarOpen)}
      >
        {isFilebarOpen ? (
          <MdChevronLeft size={30} />
        ) : (
          <MdChevronRight size={30} />
        )}
      </button>
    </div>
  )
}
