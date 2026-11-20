import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getShipment,
  InvalidShipmentIdError,
  isValidShipmentId,
  normalizeShipmentId,
  parseShipment,
  ShipmentNotFoundError,
  ShipmentServiceError,
} from './shipmentService'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

const shipment = {
  id: 'SB10000003',
  status: 'in_transit',
  currentLocation: 'Ibadan',
  origin: 'Ibadan',
  destination: 'Lagos',
  estimatedDelivery: '2026-11-23T04:47:21.494Z',
  lastUpdated: '2026-11-21T01:56:00.000Z',
  history: [
    {
      status: 'in_transit',
      location: 'Ibadan',
      timestamp: '2026-11-21T01:56:00.000Z',
    },
  ],
}

const mockedGet = vi.mocked(axios.get)

describe('shipment ID helpers', () => {
  it('trims and uppercases shipment IDs', () => {
    expect(normalizeShipmentId(' sb10000003 ')).toBe('SB10000003')
  })

  it.each(['SB10000003', 'sb10000003', ' SB10000003 '])(
    'accepts valid shipment ID %s',
    (id) => {
      expect(isValidShipmentId(id)).toBe(true)
    },
  )

  it.each(['', 'abc', 'SB123', 'SB123456789', 'XX10000003'])(
    'rejects invalid shipment ID %s',
    (id) => {
      expect(isValidShipmentId(id)).toBe(false)
    },
  )
})

describe('parseShipment', () => {
  it('returns a typed shipment from valid data', () => {
    expect(parseShipment(shipment)).toEqual(shipment)
  })

  it.each([
    ['missing ID', { ...shipment, id: undefined }],
    ['unknown status', { ...shipment, status: 'unknown' }],
    ['invalid history', { ...shipment, history: 'not an array' }],
    ['invalid history entry', { ...shipment, history: [{ status: 'unknown' }] }],
  ])('rejects %s', (_description, raw) => {
    expect(() => parseShipment(raw)).toThrow(ShipmentServiceError)
  })
})

describe('getShipment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects an invalid ID without requesting data', async () => {
    await expect(getShipment('abc')).rejects.toBeInstanceOf(InvalidShipmentIdError)
    expect(mockedGet).not.toHaveBeenCalled()
  })

  it('normalizes the ID and returns its matching shipment', async () => {
    mockedGet.mockResolvedValueOnce({ data: [shipment] })

    await expect(getShipment(' sb10000003 ', { delayMs: 0 })).resolves.toEqual(shipment)
    expect(mockedGet).toHaveBeenCalledWith('/mock/shipments.json')
  })

  it('rejects when the shipment does not exist', async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    await expect(getShipment('SB99999999', { delayMs: 0 })).rejects.toBeInstanceOf(
      ShipmentNotFoundError,
    )
  })

  it('includes the normalized ID in the not-found message', async () => {
    mockedGet.mockResolvedValueOnce({ data: [] })

    await expect(getShipment('sb99999999', { delayMs: 0 })).rejects.toThrow(
      'We could not find a shipment with tracking number SB99999999.',
    )
  })

  it('rejects malformed response data', async () => {
    mockedGet.mockResolvedValueOnce({ data: null })

    await expect(getShipment('SB10000003', { delayMs: 0 })).rejects.toBeInstanceOf(
      ShipmentServiceError,
    )
  })

  it('converts request failures to a service error', async () => {
    mockedGet.mockRejectedValueOnce(new Error('Network failure'))

    await expect(getShipment('SB10000003', { delayMs: 0 })).rejects.toThrow(
      'Could not reach the tracking service.',
    )
  })
})
