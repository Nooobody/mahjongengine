
import { howManyOrphans, isHandFinished, sortHand } from './utils.js'
import { buildContext } from './handstructure.js'

// This looks scary, but it's either this or manually mapping every logical situation.
// Performance-wise this takes 50ms - 120ms.

const allPossibleTiles = [
  '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s',
  '1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m',
  '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p',
  'e', 's', 'w', 'n', 'f', 'c', 'b'
]

export function getWaits(subHand, possibleTiles) {

  possibleTiles ||= allPossibleTiles

  let tileWaits = []
  possibleTiles.forEach(v => {
    const ascendingHand = buildContext(sortHand(subHand.concat(v), 'ASC'))
    const descendingHand = buildContext(sortHand(subHand.concat(v), 'DESC'))
    const mixedHand = buildContext(sortHand(subHand.concat(v), 'MIXED'))

    if (isHandFinished(ascendingHand) || 
        isHandFinished(descendingHand) ||
        isHandFinished(mixedHand)) {
      tileWaits.push(v)
    }
  })

  return tileWaits
}

export function calculateWaits(hand) {
  let waits = []

  let possibleTiles = allPossibleTiles.slice()
  if (howManyOrphans(hand) < 12) {
    const honors = ['e', 's', 'w', 'n', 'f', 'c', 'b']
    const honorsInHand = honors.map(v => hand.includes(v))
    possibleTiles = possibleTiles.filter(v => honors.includes(v) ? honorsInHand.includes(v) : v)
  }

  const setsInHand = ['s', 'p', 'm'].filter(v => hand.find(t => t[1] === v))
  if (setsInHand.length < 3) {
    possibleTiles = possibleTiles.filter(v => setsInHand.includes(v[1]))
  }

  hand.forEach((tile, tileIndex) => {
    const subHand = hand.filter((v, i) => i !== tileIndex)
    const tileWaits = getWaits(subHand, possibleTiles)
    if (tileWaits.length) {
      waits.push({
        discard: tile,
        waits: tileWaits
      })
    }
  })

  return waits
}

