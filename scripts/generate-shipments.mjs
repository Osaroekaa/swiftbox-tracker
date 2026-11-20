import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'

// Same seed every run, so the data (and your tests) never change unexpectedly.
faker.seed(1307)
// A fixed "now" keeps the dates identical on every run too.
const REF_DATE = new Date('2026-11-20T09:00:00Z')

const COUNT = 25
const STEPS = ['processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']
const CITIES = [
  'Lagos', 'Abuja', 'Calabar', 'Port Harcourt', 'Ibadan',
  'Kano', 'Enugu', 'Benin City', 'Uyo', 'Kaduna',
]

function buildShipment(index) {
  const id = `SB${String(10000001 + index)}`
  const stepIndex = index % STEPS.length // spread shipments across every status
  const origin = faker.helpers.arrayElement(CITIES)
  const destination = faker.helpers.arrayElement(CITIES.filter((c) => c !== origin))

  // One history entry per completed step, oldest first.
  const start = faker.date.recent({ days: 6, refDate: REF_DATE }).getTime()
  const history = STEPS.slice(0, stepIndex + 1).map((status, i) => ({
    status,
    location:
      status === 'delivered' ? destination : i === 0 ? origin : faker.helpers.arrayElement(CITIES),
    timestamp: new Date(start + i * 8 * 60 * 60 * 1000).toISOString(),
  }))
  const latest = history[history.length - 1]

  return {
    id,
    status: latest.status,
    currentLocation: latest.location,
    origin,
    destination,
    estimatedDelivery: faker.date.soon({ days: 4, refDate: REF_DATE }).toISOString(),
    lastUpdated: latest.timestamp,
    history,
  }
}

const shipments = Array.from({ length: COUNT }, (_, i) => buildShipment(i))

const here = dirname(fileURLToPath(import.meta.url))
const outFile = resolve(here, '../public/mock/shipments.json')
mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(shipments, null, 2))

console.log(`Wrote ${shipments.length} shipments to public/mock/shipments.json`)
console.log(`Try: ${shipments.map((s) => s.id).slice(0, 5).join(', ')}`)