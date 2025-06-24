// src/pages/NotFoundPage/NotFoundPage.tsx
import { Link } from "react-router-dom"
import { ROUTES } from "../../router/routes"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { MdMailOutline } from "react-icons/md"
import styles from "./ResetPasswordPage.module.css"
import { FormValidators } from "@/utils/validators"
import { useState } from "react"

import { useModalStore } from "@/store/modalStore"
import { AuthModal } from "@/components/ui/Modal"
import { ErrorModal } from "@/components/ui/Modal"

type message = {
  isValid: boolean
  text: string
}

export default function ResetPasswordPage() {
  const { openModal } = useModalStore()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [message, setMessage] = useState<message>({
    isValid: true,
    text: ""
  })

  function handleSubmit() {
    const result = FormValidators.validateEmail(email)
    setMessage({
      isValid: result.isValid,
      text: result.message
    })

    if (result.isValid) {
      const response = true // запрос на серв
      if (response) {
        setIsSubmitted(true)
      } else {
        setEmail("")
        openModal(
          <ErrorModal
            title={"Превышен лимит запросов"}
            message={
              "Превышен лимит запросов на восстановление пароля, пожалуйста, попробуйте позже"
            }
          />
        )
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {isSubmitted ? (
          <h1>
            New password has been sent to <span>{email}</span>
          </h1>
        ) : (
          <>
            <h2>Восстановление доступа к учётной записи</h2>
            <div className={styles.inputGroup}>
              <Input
                type='email'
                icon={<MdMailOutline />}
                className={styles.inputContainer}
                placeholder='Введите ваш адрес электронной почты'
                message={message}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit()
                }}
              />
              <Button onClick={handleSubmit}>Отправить письмо</Button>
            </div>
          </>
        )}
        <Link
          to={ROUTES.MAIN}
          className={`${isSubmitted ? styles.submitted : ""} link`}
          onClick={() => openModal(<AuthModal />)}
        >
          Back to authorization
        </Link>
      </div>
    </div>
  )
}
