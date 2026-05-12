import { useEffect, useState } from 'react'
import { startSyncEngine, stopSyncEngine } from './sync/sync-engine'
import PosScreen from './screens/PosScreen'
import LoginScreen from './screens/LoginScreen'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    startSyncEngine()
    return () => stopSyncEngine()
  }, [])

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return <PosScreen />
}
