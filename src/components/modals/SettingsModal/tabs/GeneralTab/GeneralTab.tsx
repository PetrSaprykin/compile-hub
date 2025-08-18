import { Switcher } from "@/components/ui/Switcher"
import { Button } from "@/components/ui/Button"
import { useUserStore } from "@/store/userStore"
import styles from "./GeneralTab.module.css"
import RuFlag from "@assets/icons/ru-flag.svg"
import UsFlag from "@assets/icons/us-flag.svg"

export const GeneralTab = () => {
  const { user } = useUserStore()
  return (
    <div className={styles.mainContainer}>
      <h3>Общие настройки</h3>
      <div className={styles.profileContainer}>
        <div className={styles.profileImg}>
          <img src='' alt='' />
        </div>
        <div className={styles.profileInfo}>
          <span className={styles.name}>{user?.username}</span>
          <span className={styles.id}>ID: {user?.id}</span>
          <span className={styles.registerDate}>Registered: 15.07.2025</span>
        </div>
      </div>
      <div className={styles.optionContainer}>
        <span>Язык приложения</span>
        {/* В пропс init value можно запихнуть настройку юзера и облачно синхронизировать*/}
        <div className={styles.langSwitcher}>
          <img src={RuFlag} alt='' />
          <Switcher />
          <img src={UsFlag} alt='' />
        </div>
      </div>
      <div className={styles.optionContainer}>
        <span>Выйти из аккаунта</span>
        <Button variant='danger' className={styles.logOutButton}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}
