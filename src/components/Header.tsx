import { useNavigate } from "react-router-dom"
import UserDropdown from "./UserDropdown"
import styles from "./Header.module.scss"

export default function Header() {
    const navigate = useNavigate()

    const handleLogoClick = () => {
        navigate("/jot")
    }

    return (
        <header className={styles.Header}>
            <span
                className={styles.Header__Logo}
                onClick={handleLogoClick}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
            >
                ai*jot
            </span>
            <UserDropdown />
        </header>
    )
}
