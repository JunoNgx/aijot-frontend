import Dexie, { type Table } from 'dexie'
import type { Item, Collection } from '../types'
import type { StorageAdapter } from './storage.interface'

class AijotDb extends Dexie {
    items!: Table<Item>
    collections!: Table<Collection>

    constructor() {
        super('aijot')
        this.version(1).stores({
            items: 'id, type, jottedAt, deletedAt, *tags',
            collections: 'id, sortOrder, slug',
        })
    }
}

const db = new AijotDb()

export const dexieAdapter: StorageAdapter = {
    async getItems() {
        return db.items.toArray()
    },

    async getItemById(id) {
        return db.items.get(id)
    },

    async putItem(item) {
        await db.items.put(item)
    },

    async deleteItem(id) {
        await db.items.delete(id)
    },

    async bulkPutItems(items) {
        await db.items.bulkPut(items)
    },

    async getCollections() {
        return db.collections.orderBy('sortOrder').toArray()
    },

    async getCollectionBySlug(slug) {
        return db.collections.where('slug').equals(slug).first()
    },

    async putCollection(collection) {
        await db.collections.put(collection)
    },

    async deleteCollection(id) {
        await db.collections.delete(id)
    },

    async bulkPutCollections(collections) {
        await db.collections.bulkPut(collections)
    },

    async purgeItemsBefore(cutoffIso) {
        const expiredIds = await db.items
            .where('deletedAt')
            .below(cutoffIso)
            .primaryKeys()
        await db.items.bulkDelete(expiredIds as string[])
    },
}
