import styles from "./Modal.module.css"
import { useModalStore } from "@/store/modalStore"
import { useEffect, useRef } from "react"

export const Modal = () => {
  const { isOpen, content, extraClass, closeModal } = useModalStore()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  if (!isOpen || !content) return null

  let modalClasses = styles.modal

  if (extraClass) {
    modalClasses = [styles.modal, styles[extraClass]].join(" ").trim()
  }

  return (
    <dialog
      ref={dialogRef}
      className={modalClasses}
      onClose={closeModal}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          closeModal()
        }
      }}
    >
      {content}
    </dialog>
  )
}
