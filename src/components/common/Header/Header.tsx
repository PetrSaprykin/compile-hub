import { useModalStore } from "@/store/modalStore"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/ui/Logo"
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher"
import { ErrorModal } from "@/components/ui/Modal"
import styles from "./Header.module.css"

export default function Header() {
  const { openModal } = useModalStore()

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <a href='/'>
          <Logo variant='standart' />
        </a>
        <div className={styles.headerButtons}>
          <ThemeSwitcher className={styles.themeSwitcher} />
          <Button
            variant='secondary'
            onClick={() =>
              openModal(
                <ErrorModal
                  title='Ooops, something went wrong'
                  message='Cannot delete file, file with this name already exists'
                />,
                "error"
              )
            }
          >
            Log In
          </Button>
          <Button variant='primary'>Sign In</Button>
        </div>
      </div>
    </header>
  )
}
