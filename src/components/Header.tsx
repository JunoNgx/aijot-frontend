import { Link } from "react-router-dom"
import UserDropdown from "./UserDropdown"
import ThemeModeDropdown from "./ThemeModeDropdown"
import styles from "./Header.module.scss"
import { ROUTE_JOT } from "@/utils/constants"

export default function Header() {
    return (
        <header className={styles.Header}>
            <Link to={ROUTE_JOT} className={styles.Header__Logo}>
                ai*jot
            </Link>
            <div className={styles.Header__RightItems}>
                <ThemeModeDropdown />
                <UserDropdown />
            </div>
        </header>
    )
}
