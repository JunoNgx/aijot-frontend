import { IconX } from "@tabler/icons-react"
import { useDialogStore } from "@/store/dialogStore"
import { parseShortcut } from "@/utils/helpers"
import {
    SHORTCUT_FOCUS_MAIN_INPUT,
    SHORTCUT_SPOTLIGHT,
    SHORTCUT_NAV_UP,
    SHORTCUT_NAV_DOWN,
    SHORTCUT_NAV_UP_SKIP,
    SHORTCUT_NAV_DOWN_SKIP,
    SHORTCUT_NAV_TOP,
    SHORTCUT_NAV_BOTTOM,
    SHORTCUT_NAV_ACTION,
    SHORTCUT_ITEM_EDIT,
    SHORTCUT_ITEM_COPY,
    SHORTCUT_ITEM_TRASH,
    SHORTCUT_ITEM_RESTORE,
    SHORTCUT_ITEM_TOGGLE_COPY_ON_CLICK,
    SHORTCUT_ITEM_REFETCH,
    SHORTCUT_ITEM_CONVERT_TO_TODO,
    SHORTCUT_SAVE_AND_CLOSE,
    SHORTCUT_SHORTCUTS_HELP,
} from "@/utils/constants"
import styles from "./ShortcutDialog.module.scss"

interface ShortcutItemProps {
    shortcut: string
    description: string
}

function ShortcutCombo({ shortcut }: { shortcut: string }) {
    const keys = parseShortcut(shortcut)
    return (
        <span className={styles.ShortcutDialog__Combo}>
            {keys.map((key, index) => (
                <span key={index} className={styles.ShortcutDialog__KeyWrapper}>
                    <kbd>{key}</kbd>
                    {index < keys.length - 1 && (
                        <span className={styles.ShortcutDialog__Plus}>+</span>
                    )}
                </span>
            ))}
        </span>
    )
}

function ShortcutItem({ shortcut, description }: ShortcutItemProps) {
    return (
        <div className={styles.ShortcutDialog__Item}>
            <ShortcutCombo shortcut={shortcut} />
            <span className={styles.ShortcutDialog__Desc}>{description}</span>
        </div>
    )
}

export default function ShortcutDialog() {
    const closeAllDialogs = useDialogStore((s) => s.closeAllDialogs)

    return (
        <div className={styles.ShortcutDialog}>
            <div className={styles.ShortcutDialog__Header}>
                <h2 className={styles.ShortcutDialog__Title}>Shortcuts</h2>
                <button
                    className="Btn Btn--Icon"
                    onClick={closeAllDialogs}
                    type="button"
                    aria-label="Close"
                >
                    <IconX size={20} strokeWidth={2} />
                </button>
            </div>

            <div className={styles.ShortcutDialog__Sections}>
                <section className={styles.ShortcutDialog__Section}>
                    <h3 className={styles.ShortcutDialog__SectionTitle}>
                        Navigation
                    </h3>
                    <div className={styles.ShortcutDialog__Grid}>
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_UP}
                            description="Previous"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_DOWN}
                            description="Next"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_UP_SKIP}
                            description="Skip 5 up"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_DOWN_SKIP}
                            description="Skip 5 down"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_TOP}
                            description="First"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_BOTTOM}
                            description="Last"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_NAV_ACTION}
                            description="Primary action"
                        />
                        <ShortcutItem
                            shortcut="Escape"
                            description="Clear selection"
                        />
                    </div>
                </section>

                <section className={styles.ShortcutDialog__Section}>
                    <h3 className={styles.ShortcutDialog__SectionTitle}>
                        Item Actions
                    </h3>
                    <div className={styles.ShortcutDialog__Grid}>
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_EDIT}
                            description="Edit"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_COPY}
                            description="Copy content"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_TRASH}
                            description="Trash"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_RESTORE}
                            description="Restore"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_TOGGLE_COPY_ON_CLICK}
                            description="Toggle copy-on-click"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_REFETCH}
                            description="Refetch link (links only)"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_ITEM_CONVERT_TO_TODO}
                            description="Convert to todo (text only)"
                        />
                    </div>
                </section>

                <section className={styles.ShortcutDialog__Section}>
                    <h3 className={styles.ShortcutDialog__SectionTitle}>App</h3>
                    <div className={styles.ShortcutDialog__Grid}>
                        <ShortcutItem
                            shortcut={SHORTCUT_FOCUS_MAIN_INPUT}
                            description="Focus input"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_SPOTLIGHT[0]}
                            description="Spotlight search"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_SAVE_AND_CLOSE}
                            description="Save and close (editor)"
                        />
                        <ShortcutItem
                            shortcut={SHORTCUT_SHORTCUTS_HELP}
                            description="Show shortcuts"
                        />
                    </div>
                </section>

                <section className={styles.ShortcutDialog__Section}>
                    <h3 className={styles.ShortcutDialog__SectionTitle}>
                        Collections
                    </h3>
                    <ShortcutItem
                        shortcut="mod+n"
                        description="Jump to collection n (1-9)"
                    />
                </section>
            </div>
        </div>
    )
}
