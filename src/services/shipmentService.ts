import axios from 'axios'
import type { Shipment, ShipmentStatus, TrackingEvent } from './shipmentTypes'

const SHIPMENTS_URL = '/mock/shipments.json'
const ID_PATTERN = /^SB\d{8}$/
const STATUSES: ShipmentStatus[] = [
  'processing',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
]

// Each failure gets its own class, so the UI can show the right message.
export class InvalidShipmentIdError extends Error {
  constructor() {
    super('Enter a tracking number like SB12345678: "SB" followed by 8 digits.')
    this.name = 'InvalidShipmentIdError'
  }
}

export class ShipmentNotFoundError extends Error {
  constructor(id: string) {
    super(`We could not find a shipment with tracking number ${id}.`)
    this.name = 'ShipmentNotFoundError'
  }
}

export class ShipmentServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ShipmentServiceError'
  }
}

/** Trims and upper-cases what the user typed, so " sb12345678 " still works. */
export function normalizeShipmentId(raw: string): string {
  return raw.trim().toUpperCase()
}

export function isValidShipmentId(raw: string): boolean {
  return ID_PATTERN.test(normalizeShipmentId(raw))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStatus(value: unknown): value is ShipmentStatus {
  return typeof value === 'string' && STATUSES.includes(value as ShipmentStatus)
}

function parseEvent(raw: unknown): TrackingEvent {
  if (
    !isRecord(raw) ||
    !isStatus(raw.status) ||
    typeof raw.location !== 'string' ||
    typeof raw.timestamp !== 'string'
  ) {
    throw new ShipmentServiceError('Received malformed tracking data.')
  }
  return { status: raw.status, location: raw.location, timestamp: raw.timestamp }
}

/** Checks one raw record from the API and returns a typed Shipment. */
export function parseShipment(raw: unknown): Shipment {
  if (
    !isRecord(raw) ||
    typeof raw.id !== 'string' ||
    !isStatus(raw.status) ||
    typeof raw.currentLocation !== 'string' ||
    typeof raw.origin !== 'string' ||
    typeof raw.destination !== 'string' ||
    typeof raw.estimatedDelivery !== 'string' ||
    typeof raw.lastUpdated !== 'string' ||
    !Array.isArray(raw.history)
  ) {
    throw new ShipmentServiceError('Received malformed tracking data.')
  }
  return {
    id: raw.id,
    status: raw.status,
    currentLocation: raw.currentLocation,
    origin: raw.origin,
    destination: raw.destination,
    estimatedDelivery: raw.estimatedDelivery,
    lastUpdated: raw.lastUpdated,
    history: raw.history.map(parseEvent),
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Looks up one shipment. Resolves with a Shipment or throws one of the
 * three error classes above. delayMs fakes network time so the spinner shows.
 */
export async function getShipment(
  rawId: string,
  { delayMs = 600 }: { delayMs?: number } = {},
): Promise<Shipment> {
  if (!isValidShipmentId(rawId)) throw new InvalidShipmentIdError()
  const id = normalizeShipmentId(rawId)

  let data: unknown
  try {
    const response = await axios.get<unknown>(SHIPMENTS_URL)
    data = response.data
  } catch {
    throw new ShipmentServiceError('Could not reach the tracking service. Please try again.')
  }

  if (delayMs > 0) await wait(delayMs)

  if (!Array.isArray(data)) throw new ShipmentServiceError('Received malformed tracking data.')
  const match = data.find((item) => isRecord(item) && item.id === id)
  if (!match) throw new ShipmentNotFoundError(id)
  return parseShipment(match)
}