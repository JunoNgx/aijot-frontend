import { dexieAdapter } from './dexie.adapter'
import type { IStorage } from './storage.interface'
import { SOFT_DELETE_PURGE_DURATION_DAY } from '../constants/misc'
import { DateTime } from 'luxon'

// Platform factory: swap adapter here for Electron (SQLite) in future
export const storage: IStorage = dexieAdapter

export async function purgeExpiredItems(): Promise<void> {
    const cutoff = DateTime.now()
        .minus({ days: SOFT_DELETE_PURGE_DURATION_DAY })

        .toISO()
    await storage.purgeItemsBefore(cutoff)
}

export type { IStorage }
