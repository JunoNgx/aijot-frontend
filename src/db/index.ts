import { dexieAdapter } from "@/db/dexie.adapter"
import type { StorageAdapter } from "@/db/storage.interface"
import {
    TRASH_PURGE_DURATION_DAY,
    SOFT_DELETE_PURGE_DURATION_DAY,
} from "@/utils/constants"
import { DateTime } from "luxon"

// Platform factory: swap adapter here for Electron (SQLite) in future
export const storage: StorageAdapter = dexieAdapter

export async function purgeExpiredItems(): Promise<void> {
    const trashCutoff = DateTime.now()
        .minus({ days: TRASH_PURGE_DURATION_DAY })
        .toISO()
    const tombstoneCutoff = DateTime.now()
        .minus({ days: SOFT_DELETE_PURGE_DURATION_DAY })
        .toISO()
    await storage.purgeTrashedItems(trashCutoff)
    await storage.purgeSoftDeletedItems(tombstoneCutoff)
}

export type { StorageAdapter }
