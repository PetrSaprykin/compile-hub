import { useModalStore } from "@/store/modalStore"

import { Button } from "../Button"

interface ErrorModalProps {
  title: string
  message: string
  className?: string
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  title = "Oops, something went wrong",
  message
}) => {
  const { closeModal } = useModalStore()
  return (
    <>
      <h3>{title}</h3>
      <p>{message}</p>
      <Button variant='secondary' onClick={closeModal}>
        OK
      </Button>
    </>
  )
}
