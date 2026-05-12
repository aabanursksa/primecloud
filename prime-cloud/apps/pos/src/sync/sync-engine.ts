import { getUnsyncedTransactions, markSynced } from '../db/local-db'

const API_BASE = 'http://localhost:4000/api/v1'

let isOnline = navigator.onLine
let syncTimer: ReturnType<typeof setInterval> | null = null

export function startSyncEngine() {
  window.addEventListener('online', () => { isOnline = true; syncNow() })
  window.addEventListener('offline', () => { isOnline = false })

  syncTimer = setInterval(() => {
    if (isOnline) syncNow()
  }, 5000) // Heartbeat every 5 seconds

  if (isOnline) syncNow()
}

export function stopSyncEngine() {
  if (syncTimer) clearInterval(syncTimer)
}

async function syncNow() {
  try {
    const pending = await getUnsyncedTransactions()
    if (pending.length === 0) return

    for (const tx of pending) {
      try {
        const payload = JSON.parse(tx.data)
        const res = await fetch(`${API_BASE}/pos/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          await markSynced(tx.id)
        }
      } catch (err) {
        console.error('Sync failed for transaction', tx.id, err)
      }
    }
  } catch (err) {
    console.error('Sync engine error', err)
  }
}

export function getOnlineStatus() {
  return isOnline
}
