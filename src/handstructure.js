
import { getTile } from './utils.js'

function getSet(tiles) {
  const { set } = getTile(tiles[0])
  return {
    tiles: tiles,
    set,
    numbers: tiles.map(getTile).map(v => v.number).sort().join(''),
    closed: true
  }
}

function getDuplicates(tile, hand) {
  let dups = []

  hand.forEach(v => {
    if (v === tile) {
      dups = dups.concat(v)
    }
  })

  return dups
}

function checkKans(tile, tileIndex, hand) {
  const dups = getDuplicates(tile, hand)
  return dups.length === 4 ? getSet(dups) : null
}

function checkPons(tile, tileIndex, hand) {
  const dups = getDuplicates(tile, hand)
  return dups.length === 3 ? getSet(dups) : null
}

function checkChis(tile, tileIndex, hand) {
  if (tile.length === 1) {
    return null
  }

  const { set: tileSet, number: tileNumber } = getTile(tile)

  const numbersToCheck = [
    [ tileNumber, tileNumber + 1, tileNumber + 2 ],
    [ tileNumber - 1, tileNumber, tileNumber + 1 ],
    [ tileNumber - 2, tileNumber - 1, tileNumber ],
  ].map(arr => arr.filter(v => v >= 1 && v <= 9))
   .filter(v => v.length === 3)

  const chis = numbersToCheck.map(numbers => {
    let chi = [tile]
    hand.forEach((v, i) => {
      const { set, number } = getTile(v)
      if (v.length === 2 && !chi.includes(v) && i !== tileIndex && set === tileSet && numbers.includes(number)) {
        chi = chi.concat(v)
      }
    })
    return chi
  })
    .filter(chi => chi.length === 3)

  if (!chis.length) {
    return null
  }

  let chi = chis[0]
  // if (chis.length > 1) {
  //   console.log("Multiple chis possible:", chis)
  // }

  return getSet(chi)
}

function filterHand(...sets) {
  let flat = sets.flat(2)
  if (!flat.length) {
    return (v) => true
  }

  return (v) => {
    const includeIndex = flat.indexOf(v)
    if (includeIndex > -1) {
      flat = flat.filter((v, i) => i !== includeIndex)
    }
    return includeIndex === -1
  }
}

function checkPairs(tile, tileIndex, hand) {
  const dups = getDuplicates(tile, hand)
  return dups.length === 2 ? getSet(dups) : null
}

export function buildContext(hand, newestTile, gamestate) {
  let chis = []
  let kans = []
  let pons = []
  let pairs = []

  const checkers = [
    [ checkChis, chis ],
    [ checkKans, kans ],
    [ checkPons, pons ],
    [ checkPairs, pairs ]
  ]

  const getCheckedTiles = () => {
    return [chis, kans, pons, pairs].map(v => v.map(t => t.tiles)).flat()
  }

  checkers.forEach(([ check, arr ], checkInd) => {
    hand.forEach((v, i) => {
      const filteredHand = hand.filter(filterHand(getCheckedTiles()))
      if (filteredHand.includes(v)) {
        const tiles = check(v, i, filteredHand)
        if (tiles){
          arr.push(tiles)
        }
      }
    })
  })

  let isClosedHand = true
  const open = gamestate?.open
  if (open) {
    isClosedHand = false
    if (open.chis) {
      chis = chis.concat(open.chis)
    }
    if (open.pons) {
      pons = pons.concat(open.pons)
    }
    if (open.kans) {
      kans = kans.concat(open.kans)
    }
  }
  
  // Extra check for possible kans, for declaring kan in any situation
  let possibleKans = []
  hand.forEach((v, i) => {
    const kans = checkKans(v, i, hand.filter(filterHand(possibleKans)))
    if (kans) {
      possibleKans.push(kans)
    }
  })

  return {
    hand,
    chis,
    kans,
    pons,
    pairs,
    possibleKans,
    newestTile,
    gamestate,
    isClosedHand,
    sets: chis.length + pons.length,
    leftOvers: hand.filter(filterHand(getCheckedTiles()))
  }
}
