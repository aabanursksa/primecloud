// Offline-first local database using IndexedDB via idb
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface PrimePOSDB extends DBSchema {
  products: {
    key: string
    value: {
      id: string
      data: string // JSON
      updatedAt: number
      version: number
    }
  }
  transactions: {
    key: string
    value: {
      id: string
      tenantId: string
      branchId: string
      data: string // JSON
      synced: number // 0=pending, 1=synced
      syncAttempts: number
      createdAt: number
      syncedAt?: number
    }
    indexes: { 'by-synced': number; 'by-created': number }
  }
}

let dbPromise: Promise<IDBPDatabase<PrimePOSDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PrimePOSDB>('prime-pos', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('transactions')) {
          const store = db.createObjectStore('transactions', { keyPath: 'id' })
          store.createIndex('by-synced', 'synced')
          store.createIndex('by-created', 'createdAt')
        }
      },
    })
  }
  return dbPromise
}

export async function saveTransaction(data: {
  id: string
  tenantId: string
  branchId: string
  payload: any
}) {
  const db = await getDB()
  await db.add('transactions', {
    id: data.id,
    tenantId: data.tenantId,
    branchId: data.branchId,
    data: JSON.stringify(data.payload),
    synced: 0,
    syncAttempts: 0,
    createdAt: Date.now(),
  })
}

export async function getUnsyncedTransactions() {
  const db = await getDB()
  const index = db.transaction('transactions').store.index('by-synced')
  return index.getAll(IDBKeyRange.only(0))
}

export async function markSynced(id: string) {
  const db = await getDB()
  const tx = db.transaction('transactions', 'readwrite')
  const item = await tx.store.get(id)
  if (item) {
    item.synced = 1
    item.syncedAt = Date.now()
    await tx.store.put(item)
  }
}

export async function saveProduct(product: { id: string; data: any; version?: number }) {
  const db = await getDB()
  await db.put('products', {
    id: product.id,
    data: JSON.stringify(product.data),
    updatedAt: Date.now(),
    version: product.version || 1,
  })
}
