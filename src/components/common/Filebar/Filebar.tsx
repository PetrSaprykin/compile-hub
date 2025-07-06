import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import styles from "./Filebar.module.css"
import { useClickDragStore } from "@/store/clickDragStore"
import { useFileNavigation } from "@/hooks/useFileNavigation"
import { MdSearch, MdChevronRight, MdChevronLeft } from "react-icons/md"
import { useEffect, useRef, useState, useMemo } from "react"
import { IoArrowBack } from "react-icons/io5"
import { Item } from "@/components/ui/Item"
import { useFileActions } from "@/hooks/useFileActions"
import { type ItemProps, type FolderItem } from "@/types/fileSystem"
import { useFileFilter } from "@/hooks/useFileFilter"
import { useFileStore } from "@/store/fileStore"
import { useMockData } from "@/hooks/useMockData"

export const Filebar = () => {
  const [isFilebarOpen, setFilebarOpen] = useState(true)
  const [searchText, setSearchText] = useState("")
  const fileListRef = useRef<HTMLDivElement>(null!)

  const { itemsArray } = useMockData()
  // получение файлов отдельным хуком
  const { items, setItems } = useFileStore()

  useEffect(() => {
    setItems(itemsArray)
  }, [])

  const folders = useMemo(
    () => items.filter((item): item is FolderItem => item.type === "folder"),
    [items]
  )

  // навигация отдельным хуком
  const {
    currentFolder,
    navigationHistory,
    goToFolder,
    goBack,
    getCurrentFolderName
  } = useFileNavigation(folders)

  // пермещение файлов отдельным хуков
  const { isDragMode, moveToTarget, cancelMove, isSelected } =
    useClickDragStore()

  const { handleCreate } = useFileActions()

  // обработчик клика по папке
  const handleClick = (item: ItemProps) => {
    if (item.type === "folder") {
      isDragMode ? moveToTarget(item.id) : goToFolder(item.id)
    } else if (!isDragMode) {
      // открытие файла
      console.log("открытие файла")
    }
  }

  const handleMoveToRoot = () => moveToTarget(null)

  const handleBackClick = () => {
    goBack()
    cancelMove()
  }

  const visibleItems = useFileFilter(items, currentFolder, searchText)

  return (
    <div
      className={`${styles.filebar} ${!isFilebarOpen ? styles.hiddenFilebar : ""}`}
    >
      <div className={styles.filebarContainer}>
        {/* Поиск */}
        <Input
          icon={<MdSearch />}
          placeholder='Searching files...'
          className={styles.search}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <hr />

        {/* Навигация */}
        <div className={styles.navigation}>
          {!isDragMode ? (
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
            // кнопки в режиме перетаскивания
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
            visibleItems.map((item: ItemProps) => (
              <Item
                key={item.id}
                {...item}
                onClick={
                  () => handleClick(item)
                  // тут же будет открытие файоа при item.type === "file"
                }
                fileListRef={fileListRef}
                isSelected={isSelected(item.id)}
                isDragMode={isDragMode}
                canDropHere={isDragMode && item.type === "folder"}
              />
            ))
          ) : (
            <span className={styles.searchError}>
              {searchText
                ? `File "${searchText}" not found`
                : "Folder is empty"}
            </span>
          )}
        </div>

        <hr />

        {/* Кнопки создания папки или файла */}
        <div className={styles.createingButtons}>
          <Button variant='secondary' onClick={() => handleCreate("file")}>
            New file
          </Button>
          <Button variant='secondary' onClick={() => handleCreate("folder")}>
            New folder
          </Button>
        </div>
      </div>

      {/* Переключатель файлбара */}
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
