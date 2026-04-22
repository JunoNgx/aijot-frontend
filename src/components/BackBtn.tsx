import { useNavigate } from "react-router-dom"
import { IconArrowNarrowLeft } from "@tabler/icons-react"
import styles from "./BackBtn.module.scss"
import { ICON_PROPS_ACTION } from "@/config/constants"

export default function BackBtn() {
    const navigate = useNavigate()

    return (
        <button
            className={`Btn Btn--Quart ${styles.BackBtn}`}
            onClick={() => navigate(-1)}
        >
            <IconArrowNarrowLeft {...ICON_PROPS_ACTION} />
            return
        </button>
    )
}
