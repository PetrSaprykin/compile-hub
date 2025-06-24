import styles from "./FileCard.module.css"
import { FaFileCode } from "react-icons/fa"
import { IoEllipsisVertical } from "react-icons/io5"

export const FileCard = () => {
  return (
    <div className={styles.fileCard}>
      <FaFileCode size={36} />
      <span>script.js</span>
      <IoEllipsisVertical size={36} className={styles.options} />
    </div>
  )
}
