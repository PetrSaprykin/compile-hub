import { useEffect, useState } from "react"
import styles from "./Input.module.css"
import { CgSpinner } from "react-icons/cg"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isRequired?: boolean
  isValidating?: boolean
  icon?: React.ReactNode
  message?: { isValid: boolean; text: string }
  hidePassDeps?: any[]
}

export const Input: React.FC<InputProps> = ({
  icon,
  isRequired = false,
  isValidating = false,
  message,
  hidePassDeps = [],
  ...props
}) => {
  const [showPass, setShowPass] = useState(false)

  const showPassIconProps = {
    onClick: () => setShowPass(!showPass),
    className: styles.showPass
  }

  useEffect(() => {
    setShowPass(false)
  }, hidePassDeps)

  let showPasswordIcon = showPass ? (
    <IoEyeOffOutline {...showPassIconProps} />
  ) : (
    <IoEyeOutline {...showPassIconProps} />
  )
  return (
    <div
      className={`${styles.inputContainer} ${message?.text ? styles.hasNote : ""} ${props.className}`}
    >
      <div className={styles.inputLine}>
        {icon}
        <input
          {...props}
          type={!showPass && props.type === "password" ? "password" : "text"}
          className={`${isValidating ? styles.isValidating : ""} ${props.type === "password" ? styles.isPassword : ""}`}
        />
        {isValidating && <CgSpinner className={styles.spinner} />}
        {props.type === "password" && showPasswordIcon}
      </div>
      {message?.text && (
        <p className={styles[message.isValid ? "successNote" : "errorNote"]}>
          {message?.text}
        </p>
      )}
    </div>
  )
}
