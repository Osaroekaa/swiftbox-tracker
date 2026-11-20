import { useCallback, useEffect, useRef, useState } from 'react'
import { getShipment } from '../services/shipmentService'
import type { Shipment } from '../services/shipmentTypes'

// One state at a time, so the UI can never show a spinner and an error together.
export type LookupState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'success'; shipment: Shipment }
  | { phase: 'error'; error: Error }

export function useShipmentLookup() {
  const [state, setState] = useState<LookupState>({ phase: 'idle' })
  // Counts searches. A result only counts if it belongs to the latest search.
  const latestSearch = useRef(0)

  useEffect(() => {
    const searches = latestSearch
    // Leaving the page invalidates any search still in flight.
    return () => {
      searches.current += 1
    }
  }, [])

  const search = useCallback(async (id: string) => {
    const searchId = ++latestSearch.current
    setState({ phase: 'loading' })
    try {
      const shipment = await getShipment(id)
      if (searchId === latestSearch.current) setState({ phase: 'success', shipment })
    } catch (err) {
      if (searchId === latestSearch.current) {
        const error = err instanceof Error ? err : new Error('Something went wrong.')
        setState({ phase: 'error', error })
      }
    }
  }, [])

  return { state, search }
}