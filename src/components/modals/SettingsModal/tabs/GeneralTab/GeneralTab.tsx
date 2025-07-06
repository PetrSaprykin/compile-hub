import { Switcher } from "@/components/ui/Switcher"
import styles from "./GeneralTab.module.css"
import RuFlag from "@assets/icons/ru-flag.svg"
import UsFlag from "@assets/icons/us-flag.svg"

export const GeneralTab = () => {
  return (
    <div className={styles.mainContainer}>
      <h3>Общие настройки</h3>

      <div className={styles.optionContainer}>
        <span>Язык приложения</span>
        {/* В пропс init value можно запихнуть настройку юзера и облачно синхронизировать*/}
        <div className={styles.langSwitcher}>
          <img src={RuFlag} alt='' />
          <Switcher />
          <img src={UsFlag} alt='' />
        </div>
      </div>
    </div>
  )
}
