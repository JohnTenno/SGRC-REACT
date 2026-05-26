import { useEffect } from 'react'

export function useRefetchOnWindowFocus(refetch) {
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') refetch()
    }

    window.addEventListener('focus', refetch)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', refetch)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [refetch])
}
