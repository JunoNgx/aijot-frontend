import { useProfileSettings } from "@/store/profileSettings"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useLocalSyncData } from "@/store/localSyncData"
import { isValidHexColourCode } from "@/utils/helpers"
import styles from "./index.module.scss"

export default function Settings() {
    const userDisplayName = useProfileSettings((s) => s.userDisplayName)
    const setUserDisplayName = useProfileSettings((s) => s.setUserDisplayName)
    const shouldApplyTagsOfCurrCollection = useProfileSettings(
        (s) => s.shouldApplyTagsOfCurrCollection,
    )
    const setShouldApplyTagsOfCurrCollection = useProfileSettings(
        (s) => s.setShouldApplyTagsOfCurrCollection,
    )

    const allCollection = useCoreCollectionSettings((s) => s.all)
    const setAll = useCoreCollectionSettings((s) => s.setAll)
    const untaggedCollection = useCoreCollectionSettings((s) => s.untagged)
    const setUntagged = useCoreCollectionSettings((s) => s.setUntagged)
    const trashCollection = useCoreCollectionSettings((s) => s.trash)
    const setTrash = useCoreCollectionSettings((s) => s.setTrash)

    const syncStatus = useLocalSyncData((s) => s.syncStatus)
    const lastSyncTime = useLocalSyncData((s) => s.lastSyncTime)

    const handleColorChange = (
        setter: (config: { name?: string; colour?: string }) => void,
        value: string,
    ) => {
        if (isValidHexColourCode(value)) {
            setter({ colour: value.slice(-7) })
        }
    }

    return (
        <div className={styles.Settings}>
            <h1 className={styles.Settings__Title}>Settings</h1>

            <section className={styles.Settings__Section}>
                <div className={styles.Settings__SectionHeader}>
                    <h2 className={styles.Settings__SectionTitle}>Profile</h2>
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Label} htmlFor="displayName">
                        Display name
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        className={styles.Settings__Input}
                        value={userDisplayName}
                        onChange={(e) => setUserDisplayName(e.target.value)}
                    />
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Checkbox}>
                        <input
                            type="checkbox"
                            checked={shouldApplyTagsOfCurrCollection}
                            onChange={(e) => setShouldApplyTagsOfCurrCollection(e.target.checked)}
                        />
                        Auto-apply collection tags when creating items
                    </label>
                </div>
            </section>

            <section className={styles.Settings__Section}>
                <div className={styles.Settings__SectionHeader}>
                    <h2 className={styles.Settings__SectionTitle}>Core Collections</h2>
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Label} htmlFor="allName">
                        All items
                    </label>
                    <input
                        id="allName"
                        type="text"
                        className={styles.Settings__Input}
                        value={allCollection.name}
                        onChange={(e) => setAll({ name: e.target.value })}
                    />
                    <input
                        type="text"
                        className={styles.Settings__SlugInput}
                        value={allCollection.slug}
                        onChange={(e) => setAll({ slug: e.target.value })}
                        aria-label="Slug"
                    />
                    <input
                        type="color"
                        className={styles.Settings__ColorInput}
                        value={allCollection.colour}
                        onChange={(e) => handleColorChange(setAll, e.target.value)}
                    />
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Label} htmlFor="untaggedName">
                        Untagged
                    </label>
                    <input
                        id="untaggedName"
                        type="text"
                        className={styles.Settings__Input}
                        value={untaggedCollection.name}
                        onChange={(e) => setUntagged({ name: e.target.value })}
                    />
                    <input
                        type="text"
                        className={styles.Settings__SlugInput}
                        value={untaggedCollection.slug}
                        onChange={(e) => setUntagged({ slug: e.target.value })}
                        aria-label="Slug"
                    />
                    <input
                        type="color"
                        className={styles.Settings__ColorInput}
                        value={untaggedCollection.colour}
                        onChange={(e) => handleColorChange(setUntagged, e.target.value)}
                    />
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Label} htmlFor="trashName">
                        Trash
                    </label>
                    <input
                        id="trashName"
                        type="text"
                        className={styles.Settings__Input}
                        value={trashCollection.name}
                        onChange={(e) => setTrash({ name: e.target.value })}
                    />
                    <input
                        type="text"
                        className={styles.Settings__SlugInput}
                        value={trashCollection.slug}
                        onChange={(e) => setTrash({ slug: e.target.value })}
                        aria-label="Slug"
                    />
                    <input
                        type="color"
                        className={styles.Settings__ColorInput}
                        value={trashCollection.colour}
                        onChange={(e) => handleColorChange(setTrash, e.target.value)}
                    />
                </div>
            </section>

            <section className={styles.Settings__Section}>
                <div className={styles.Settings__SectionHeader}>
                    <h2 className={styles.Settings__SectionTitle}>Sync</h2>
                </div>
                <p className={styles.Settings__SectionDescription}>
                    Back up your data to Google Drive
                </p>
                {syncStatus !== "idle" && (
                    <div className={styles.Settings__SyncStatus}>
                        {syncStatus === "syncing" && "Syncing..."}
                        {syncStatus === "error" && "Sync error"}
                        {lastSyncTime && `Last sync: ${lastSyncTime}`}
                    </div>
                )}
                <button className={styles.Settings__BtnConnect} type="button">
                    Connect
                </button>
            </section>
        </div>
    )
}
