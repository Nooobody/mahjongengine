
import { 
  isTerminal,
  isHonor,
  isPinfuHand,
  isOpenHand,
  hasValuePair
} from './utils.js'
import { getWaits } from './waits.js'
import oneYakus from './yakus/1han.js'
import twoYakus from './yakus/2han.js'
import threeFiveYakus from './yakus/35han.js'
import yakumans from './yakus/yakuman.js'
import yakuEnum from './yakus/enum.js'

export const MANGAN = 2000
export const HANEMAN = 3000
export const BAIMAN = 4000
export const SANBAIMAN = 6000
export const YAKUMAN = 8000

const isSevenPairs = (ctx) => ctx.pairs.length === 7

const yakuList = [
  ...oneYakus,
  ...twoYakus,
  ...threeFiveYakus
]

function scoreMinipoints(ctx) {
  if (isSevenPairs(ctx)) {
    return 25
  }

  const base = 20

  let points = base

  if (ctx.isClosedHand && ctx.gamestate.newestTileType === "discard") {
    // Closed ron
    points += 10
  }

  ctx.waitFu = getWaitFu(ctx)
  points += ctx.waitFu

  if (isPinfuHand(ctx) && isOpenHand(ctx) && ctx.waitFu === 0) {
    points += 2 // Open pinfu
  }

  const { pons, kans } = ctx

  points += hasValuePair(ctx) ? 2 : 0

  if (kans.length) {
    kans.forEach(kan => {
      const isHonorOrTerminal = isTerminal(kan.tiles[0]) || isHonor(kan.tiles[0]) ? 2 : 1
      const isClosed = kan.closed ? 2 : 1
      points += 8 * isHonorOrTerminal * isClosed
    })
  }

  if (pons.length) {
    pons.forEach(pon => {
      const isHonorOrTerminal = isTerminal(pon.tiles[0]) || isHonor(pon.tiles[0]) ? 2 : 1
      const isClosed = pon.closed ? 2 : 1
      points += 2 * isHonorOrTerminal * isClosed
    })
  }

  if (points % 10 !== 0) {
    points = Math.ceil(points / 10) * 10
  }

  return points
}

function calculateBasePoints({ han, fu, isEast }) {
  const eastBonus = isEast ? 1 : 0
  return fu * Math.pow(2, 2 + han + eastBonus)
}

export function getWaitFu(ctx) {
  const { hand } = ctx
  const { newestTile } = ctx.gamestate
  const tileInd = hand.findIndex(v => v === newestTile)
  const subHand = hand.filter((v, i) => i !== tileInd)

  const waits = getWaits(subHand)
  console.log(ctx)
  console.log(waits)
  if (waits.length === 1) {
    return 2
  }

  if (isPinfuHand(ctx)) {
    return 0
  }

  // TODO: Add edge cases when calculating highest possible points
  return 0
}

function roundPoints(points) {
  return Math.ceil(points / 100) * 100
}

export function getBasePoints(han, fu) {
  let points, eastPoints
  if (han < 5) {
    points = calculateBasePoints({ han, fu, isEast: false })
    eastPoints = calculateBasePoints({ han, fu, isEast: true })
    if (points > MANGAN) {
      points = MANGAN
      eastPoints = points * 2
    }
  }
  else {
    switch(han) {
      case 5:
        points = MANGAN
        break
      case 6:
      case 7:
        points = HANEMAN
        break
      case 8:
      case 9:
      case 10:
        points = BAIMAN
        break
      default:
        points = SANBAIMAN
    }
    eastPoints = points * 2
  }

  return { points, eastPoints }
}

export function getSeatPoints({ points, eastPoints, seatWind, newestTileType }) {
  if (newestTileType === 'discard') {
    if (seatWind === 'e') {
      return {
        points: roundPoints(eastPoints * 3),
        eastPoints: null
      }
    }
    else {
      return {
        points: roundPoints(points * 4),
        eastPoints: null
      }
    }
  }

  if (seatWind === 'e') {
    return {
      points: roundPoints(eastPoints),
      eastPoints: null
    }
  } 

  return {
    points: roundPoints(points),
    eastPoints: roundPoints(eastPoints),
  }

}

function scoreHand(ctx) {
  const yakuman = yakumans.find(yaku => yaku.resolver(ctx))

  if (yakuman) {
    return {
      isYakuman: true,
      points: YAKUMAN, // TODO: Add East & tsumo/ron
      yakuman
    }
  }

  const fu = scoreMinipoints(ctx)
  
  let han = 0

  let yakus = []

  const usedYakus = ctx.isClosedHand ? yakuList : yakuList.filter(v => !v.closedOnly)

  usedYakus.forEach(yaku => {
    if (yaku.resolver(ctx)) {
      yakus.push({ ...yaku, name: Object.keys(yakuEnum)[yaku.yaku] })
    }
  })

  const excludedYakus = yakus.filter(v => v.excludes).map(v => v.excludes).flat()
  yakus = yakus.filter(v => !excludedYakus.includes(v.yaku))

  yakus.forEach(v => ctx.isClosedHand ? han += v.hanClosed || v.han : han += v.han)

  const dora = ctx.gamestate.dora
  ctx.hand.forEach(v => dora.includes(v) ? han += 1 : null)

  const { points, eastPoints } = getBasePoints(han, fu)
  const res = {
    fu,
    han,
    yakus
  }

  const { gamestate } = ctx
  const { seatWind, newestTileType } = gamestate
  const seatPoints = getSeatPoints({ points, eastPoints, seatWind, newestTileType })

  return {
    ...res,
    ...seatPoints
  }
}

export default scoreHand
