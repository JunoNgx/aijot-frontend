import { Link } from "react-router-dom"
import UserDropdown from "./UserDropdown"
import ThemeModeDropdown from "./ThemeModeDropdown"
import styles from "./Header.module.scss"

export default function Header() {
    return (
        <header className={styles.Header}>
            <Link to="/jot" className={styles.Header__Logo}>
                ai*jot
            </Link>
            <div className={styles.Header__Actions}>
                <ThemeModeDropdown />
                <UserDropdown />
            </div>
        </header>
    )
}
