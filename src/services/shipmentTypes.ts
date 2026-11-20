export type ShipmentStatus =
  | 'processing'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'

export interface TrackingEvent {
  status: ShipmentStatus
  location: string
  timestamp: string
}

export interface Shipment {
  id: string
  status: ShipmentStatus
  currentLocation: string
  origin: string
  destination: string
  estimatedDelivery: string
  lastUpdated: string
  history: TrackingEvent[]
}