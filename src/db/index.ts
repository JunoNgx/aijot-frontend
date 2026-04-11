import { dexieAdapter } from '@/db/dexie.adapter'
import type { StorageAdapter } from '@/db/storage.interface'
import { SOFT_DELETE_PURGE_DURATION_DAY } from '@/utils/constants'
import { DateTime } from 'luxon'

// Platform factory: swap adapter here for Electron (SQLite) in future
export const storage: StorageAdapter = dexieAdapter

export async function purgeExpiredItems(): Promise<void> {
    const cutoff = DateTime.now()
        .minus({ days: SOFT_DELETE_PURGE_DURATION_DAY })

        .toISO()
    await storage.purgeItemsBefore(cutoff)
}

export type { StorageAdapter }
