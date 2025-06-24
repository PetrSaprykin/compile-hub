import styles from "./FolderCard.module.css"
import { FaFolder } from "react-icons/fa"
import { IoEllipsisVertical } from "react-icons/io5"

export const FolderCard = () => {
  return (
    <div className={styles.folderCard}>
      <FaFolder size={36} className={styles.folderIcon} />
      <span>Labs</span>
      <IoEllipsisVertical size={36} className={styles.options} />
    </div>
  )
}
