
export function getTile(tile) {
  if (tile.length === 2) {
    return {
      set: tile[1],
      number: parseInt(tile[0])
    }
  }
  else {
    return {
      set: ['c', 'f', 'b'].includes(tile.toLowerCase()) ? 'd' : 'w',
      number: tile
    }
  }
}

export function isTerminal(tile) {
  return tile.length === 2 && (tile[0] === "1" || tile[0] === "9")
}

export function isHonor(tile) {
  return [ 'e', 's', 'w', 'n', 'f', 'c', 'b'].includes(tile)
}

export function isDragon(tile) {
  return ['f', 'c', 'b'].includes(tile)
}

export function isWind(tile) {
  return ['e', 's', 'w', 'n'].includes(tile)
}

export function isIdenticalSet(setA, setB) {
  const setBSorted = setB.slice().sort()
  return setA.slice().sort().every((v, i) => v === setBSorted[i])
}

export function isClosedHand({ chis, pons, kans }) {
  return chis.concat(pons, kans).every(v => v.closed)
}

export function isOpenHand({ chis, pons, kans }) {
  return chis.concat(pons, kans).some(v => !v.closed)
}

export function isPinfuHand(ctx) {
  return ctx.chis.length === 4 && !hasValuePair(ctx)
}

export function hasValuePair(ctx) {
  const { seatWind, roundWind } = ctx.gamestate
  const pair = ctx.pairs[0]
  return pair.set === 'd' || pair.numbers.includes(seatWind) || pair.numbers.includes(roundWind)
}

export function hasHonorInHand(hand) {
  return hand.some(v => isHonor(v))
}

export function hasHonorOrTerminalInSet(set) {
  return set.tiles.some(v => isTerminal(v) || isHonor(v))
}

export function howManySets(hand) {
  return hand.reduce((acc, cur) => {
    if (cur.length === 2) {
      const set = cur[1]
      if (!acc.includes(set)) {
        acc.push(set)
      }
    }
    return acc
  }, []).length
}

export function howManyOrphans(hand) {
  const orphans = [
    'e', 's', 'w', 'n',
    'f', 'c', 'b',
    '1s', '9s', '1p', '9p', '1m', '9m'
  ]
  return orphans.reduce((acc, cur) => hand.includes(cur) ? acc + 1 : acc, 0)
}

export function isThirteenOrphans({ hand, pairs }) {
  const hasAll = howManyOrphans(hand) === 13

  return hasAll && pairs.length === 1
}

export function isHandInTenpai(ctx) {
  const { sets, pairs } = ctx

  const orphans = howManyOrphans(ctx.hand)
  const isKokushiTenpai = orphans === 13 && pairs.length === 0 || orphans === 12 && pairs.length >= 1

  return sets === 4 && pairs.length !== 1 || sets === 3 && pairs.length >= 1 || pairs.length === 6 || isKokushiTenpai
}

export function isHandFinished(ctx) {
  const { sets, pairs, leftOvers } = ctx

  return sets === 4 && pairs.length === 1 || pairs.length === 7 || isThirteenOrphans(ctx)
}

export function isSequence(tiles) {
  const numberSequence = tiles
    .map(v => parseInt(v[0]))
    .sort()

  let previous = numberSequence[0]
  for (let v of numberSequence.slice(1)) {
    const inSequence = v - previous === 1
    if (!inSequence) {
      return false
    }
    previous = v
  }
  return true
}

function sortHandFn(a, b) {
  if (a.length === 2 && b.length === 2) {
    if (a[1] === b[1]) {
      return parseInt(a[0]) - parseInt(b[0])
    } else {
      return a[1].localeCompare(b[1])
    }
  }
  return a.localeCompare(b)
}

export function sortHand(hand, dir) {
  return dir === 'ASC'
    ? hand.slice().sort((a, b) => sortHandFn(a, b))
    : hand.slice().sort((a, b) => sortHandFn(b, a))
}
