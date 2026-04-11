import type { CoreCollectionConfig } from '../types'

export const DEFAULT_ALL_COLLECTION: CoreCollectionConfig = {
    name: 'Everything',
    slug: 'all',
    icon: '📦',
    colour: '#d0d0d0',
}

export const DEFAULT_UNTAGGED_COLLECTION: CoreCollectionConfig = {
    name: 'Untagged',
    slug: 'untagged',
    icon: '🏷️',
    colour: '#f5a623',
}

export const DEFAULT_TRASH_COLLECTION: CoreCollectionConfig = {
    name: 'Trash',
    slug: 'trash',
    icon: '🗑️',
    colour: '#c0392b',
}
