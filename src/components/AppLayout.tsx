import { Outlet } from "react-router-dom"
import Header from "./Header"
import styles from "./AppLayout.module.scss"

export default function AppLayout() {
    return (
        <div className={styles.AppLayout}>
            <Header />
            <div className={styles.AppLayout__OutletWrapper}>
                <Outlet />
            </div>
        </div>
    )
}
