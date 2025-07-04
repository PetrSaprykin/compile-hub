import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/router/routes"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Logo } from "@/components/ui/Logo"
import { useAuthStore } from "@/store/authStore"
import { useModalStore } from "@/store/modalStore"
import { CgSpinner } from "react-icons/cg"
import { MdLockOutline, MdMailOutline, MdPersonOutline } from "react-icons/md"

import styles from "./AuthModal.module.css"

interface AuthModalProps {
  className?: string
  isReg?: boolean
}

export const AuthModal: React.FC<AuthModalProps> = ({ isReg = false }) => {
  const [mode, setMode] = useState<"register" | "login">(
    isReg ? "register" : "login"
  )
  const [isLoading, setIsLoading] = useState(false)

  interface MessageState {
    text: string
    isSuccess: boolean
  }

  const [statusMessage, setStatusMessage] = useState<MessageState>({
    text: "",
    isSuccess: true
  })

  const {
    username,
    email,
    password,
    confirmPassword,
    errors,
    isValidating,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    resetForm,
    submitForm,
    isValid
  } = useAuthStore()

  const { setIsLocked, closeModal } = useModalStore()

  const hidePassTrigger = useMemo(
    () => [mode, isLoading, password],
    [mode, isLoading, password]
  )

  useEffect(() => {
    resetForm()
    setStatusMessage({ text: "", isSuccess: true })
  }, [mode])

  const handleSubmit = async () => {
    if (!username) setUsername("", mode === "register")
    if (!email && mode === "register") setEmail("")
    if (!password) setPassword("")
    if (!confirmPassword && mode === "register") setConfirmPassword("")

    setStatusMessage({ text: "", isSuccess: true })

    console.log(`Отправка формы ${mode}`)
    if (!isValid(mode)) return

    setIsLocked(true)
    setIsLoading(true)
    try {
      const result = await submitForm(mode)

      const [statusMessage, success] = result

      console.log(statusMessage, success)

      if (success) {
        if (mode === "register") {
          resetForm()
          setIsLoading(false)
          setStatusMessage({ text: statusMessage, isSuccess: true })
        } else {
          // setIsLoading(false) но скорее всего просто закрытие окна
          console.log("Login successful")
        }
      } else {
        if (mode === "register") {
          setIsLoading(false)
          setStatusMessage({
            text: "Failed to  sign up, please  again later",
            isSuccess: false
          })
        } else {
          setIsLoading(false)
          setStatusMessage({
            text: "Failed to log in, check your credentials",
            isSuccess: false
          })
        }
      }
    } finally {
      setIsLoading(false)
      setIsLocked(false)
    }
  }

  return (
    <div className={styles.content}>
      <Logo variant='compact' />
      <h3 style={{ fontWeight: 400 }}>Welcome to CompileHub!</h3>
      <div className={styles.authForm}>
        <Input
          type='text'
          className={`${errors.username.isAvialable ? "success" : "error"} ${styles.input}`}
          isRequired={true}
          isValidating={isValidating}
          icon={<MdPersonOutline />}
          placeholder='Enter username'
          disabled={isLoading}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value, mode === "register")
          }}
          message={{
            isValid: errors.username.isAvialable,
            text: errors.username.message
          }}
          name='username'
        />
        {mode === "register" && (
          <Input
            type='email'
            className={styles.input}
            isRequired={true}
            icon={<MdMailOutline />}
            placeholder='Enter email'
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            message={{ isValid: false, text: errors.email }}
            name='email'
          />
        )}

        <Input
          type='password'
          className={styles.input}
          isRequired={true}
          icon={<MdLockOutline />}
          placeholder='Enter password'
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          message={{ isValid: false, text: errors.password }}
          name='password'
          hidePassDeps={hidePassTrigger}
        />
        {mode === "register" && (
          <Input
            type='password'
            className={styles.input}
            isRequired={true}
            icon={<MdLockOutline />}
            placeholder='Confirm password'
            disabled={isLoading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            message={{ isValid: false, text: errors.confirmPassword }}
            name='confirm password'
            hidePassDeps={hidePassTrigger}
          />
        )}
      </div>

      <div className={styles.buttonGroup}>
        <p
          className={`${styles.statusMessage} ${styles[statusMessage.isSuccess ? "green" : "red"]}`}
        >
          {/* пробел чтобы не менялся размер окошка при появлении сообщени */}
          {statusMessage.text || "\u00A0"}
        </p>
        <Button
          variant={mode === "register" ? "secondary" : "primary"}
          disabled={isLoading || isValidating}
          onClick={() => {
            if (mode === "register") {
              setMode("login")
            } else {
              handleSubmit()
            }
          }}
        >
          {isLoading && !(mode === "register") ? (
            <CgSpinner size={25} className={styles.buttonLoadSpinner} />
          ) : (
            "Log In"
          )}
        </Button>
        <Button
          variant={mode === "register" ? "primary" : "secondary"}
          style={{ order: `${mode === "register" ? 0 : -1}` }}
          disabled={
            isLoading ||
            isValidating ||
            (!errors.username.isAvialable && mode === "register")
          }
          onClick={() => {
            if (mode === "login") {
              setMode("register")
            } else {
              handleSubmit()
            }
          }}
        >
          {isLoading && mode === "register" ? (
            <CgSpinner size={25} className={styles.buttonLoadSpinner} />
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>
      <Link
        to={ROUTES.PASSWORD_RESET}
        className={`link ${styles.forgotPassword}`}
        onClick={closeModal}
      >
        Forgot password? Click here
      </Link>
    </div>
  )
}
