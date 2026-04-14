import { useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { useProfileSettings } from "@/store/profileSettings"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useLocalSyncData } from "@/store/localSyncData"
import { isValidHexColourCode } from "@/utils/helpers"
import {
    exportData,
    parseImportFile,
    getImportSummary,
    commitImport,
} from "@/services/exportImport"
import type { ExportData, ImportSummary } from "@/types"
import { queryKeys } from "@/db/queryKeys"
import styles from "./index.module.scss"

export default function Settings() {
    const queryClient = useQueryClient()
    const importInputRef = useRef<HTMLInputElement>(null)
    const [pendingImport, setPendingImport] = useState<ExportData | null>(null)
    const [importSummary, setImportSummary] = useState<ImportSummary | null>(
        null,
    )

    const themeMode = useLocalUserSettings((s) => s.themeMode)
    const setThemeMode = useLocalUserSettings((s) => s.setThemeMode)

    const use24HourClock = useProfileSettings((s) => s.use24HourClock)
    const setUse24HourClock = useProfileSettings((s) => s.setUse24HourClock)

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

    const handleExport = async () => {
        await exportData({
            profile: { userDisplayName, shouldApplyTagsOfCurrCollection },
            coreCollections: {
                all: allCollection,
                untagged: untaggedCollection,
                trash: trashCollection,
            },
        })
    }

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const data = await parseImportFile(file)
            const summary = await getImportSummary(data)
            setPendingImport(data)
            setImportSummary(summary)
        } catch {
            toast.error("Failed to read file: invalid format")
        } finally {
            e.target.value = ""
        }
    }

    const handleConfirmImport = async () => {
        if (!pendingImport) return
        try {
            const settings = await commitImport(pendingImport)
            setUserDisplayName(settings.profile.userDisplayName)
            setShouldApplyTagsOfCurrCollection(
                settings.profile.shouldApplyTagsOfCurrCollection,
            )
            setAll(settings.coreCollections.all)
            setUntagged(settings.coreCollections.untagged)
            setTrash(settings.coreCollections.trash)
            queryClient.invalidateQueries({ queryKey: queryKeys.items })
            queryClient.invalidateQueries({ queryKey: queryKeys.collections })
            toast("Data imported successfully")
        } catch {
            toast.error("Failed to import data")
        } finally {
            setPendingImport(null)
            setImportSummary(null)
        }
    }

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
                    <h2 className={styles.Settings__SectionTitle}>
                        Appearance
                    </h2>
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Label}>Theme</label>
                    <div className={styles.Settings__RadioGroup}>
                        {(["light", "dark", "system"] as const).map((mode) => (
                            <label
                                key={mode}
                                className={styles.Settings__Radio}
                            >
                                <input
                                    type="radio"
                                    name="themeMode"
                                    value={mode}
                                    checked={themeMode === mode}
                                    onChange={() => {
                                        setThemeMode(mode)
                                    }}
                                />
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
                <div className={styles.Settings__Field}>
                    <label className={styles.Settings__Checkbox}>
                        <input
                            type="checkbox"
                            checked={use24HourClock}
                            onChange={(e) => {
                                setUse24HourClock(e.target.checked)
                            }}
                        />
                        Use 24-hour clock
                    </label>
                </div>
            </section>

            <section className={styles.Settings__Section}>
                <div className={styles.Settings__SectionHeader}>
                    <h2 className={styles.Settings__SectionTitle}>Profile</h2>
                </div>
                <div className={styles.Settings__Field}>
                    <label
                        className={styles.Settings__Label}
                        htmlFor="displayName"
                    >
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
                            onChange={(e) =>
                                setShouldApplyTagsOfCurrCollection(
                                    e.target.checked,
                                )
                            }
                        />
                        Auto-apply collection tags when creating items
                    </label>
                </div>
            </section>

            <section className={styles.Settings__Section}>
                <div className={styles.Settings__SectionHeader}>
                    <h2 className={styles.Settings__SectionTitle}>
                        Core Collections
                    </h2>
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
                        onChange={(e) =>
                            handleColorChange(setAll, e.target.value)
                        }
                    />
                </div>
                <div className={styles.Settings__Field}>
                    <label
                        className={styles.Settings__Label}
                        htmlFor="untaggedName"
                    >
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
                        onChange={(e) =>
                            handleColorChange(setUntagged, e.target.value)
                        }
                    />
                </div>
                <div className={styles.Settings__Field}>
                    <label
                        className={styles.Settings__Label}
                        htmlFor="trashName"
                    >
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
                        onChange={(e) =>
                            handleColorChange(setTrash, e.target.value)
                        }
                    />
                </div>
            </section>

            <section className={styles.Settings__Section}>
                <div className={styles.Settings__SectionHeader}>
                    <h2 className={styles.Settings__SectionTitle}>Data</h2>
                </div>
                <p className={styles.Settings__SectionDescription}>
                    Export or import your items, collections, and settings
                </p>
                <div className={styles.Settings__BtnRow}>
                    <button
                        className={styles.Settings__BtnAction}
                        type="button"
                        onClick={handleExport}
                    >
                        Export
                    </button>
                    <button
                        className={styles.Settings__BtnAction}
                        type="button"
                        onClick={() => importInputRef.current?.click()}
                    >
                        Import
                    </button>
                    <input
                        ref={importInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={handleImportFile}
                    />
                </div>
                {pendingImport && importSummary && (
                    <div className={styles.Settings__ImportPreview}>
                        <span>
                            {importSummary.newItems} new,{" "}
                            {importSummary.updatedItems} updated items
                        </span>
                        <span>
                            {importSummary.newCollections} new,{" "}
                            {importSummary.updatedCollections} updated
                            collections
                        </span>
                        <div className={styles.Settings__ImportPreviewActions}>
                            <button
                                className={styles.Settings__BtnAction}
                                type="button"
                                onClick={handleConfirmImport}
                            >
                                Confirm
                            </button>
                            <button
                                className={styles.Settings__BtnAction}
                                type="button"
                                onClick={() => {
                                    setPendingImport(null)
                                    setImportSummary(null)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
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
