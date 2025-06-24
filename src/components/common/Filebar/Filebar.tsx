import { useModalStore } from "@/store/modalStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import styles from "./Filebar.module.css"
import { FileCard } from "@/components/ui/FileCard"
import { FolderCard } from "@/components/ui/FolderCard"
import { MdSearch } from "react-icons/md"

export const Filebar = () => {
  const { openModal } = useModalStore()

  return (
    <div className={styles.filebar}>
      <div className={styles.filebarContainer}>
        <Input
          icon={<MdSearch />}
          placeholder='Введите имя файла'
          className={styles.search}
        />
        <hr />
        <div className={styles.fileList}>
          <FolderCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
        </div>
        <hr />
        <div className={styles.buttons}>
          <Button variant='secondary'>New File</Button>
          <Button variant='secondary'>New Folder</Button>
        </div>
      </div>
    </div>
  )
}
