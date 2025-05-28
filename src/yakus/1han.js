
import yakuEnum from './enum.js'
import { getDuplicates } from '../handstructure.js'
import { 
  isTerminal,
  isHonor,
  isPinfuHand,
  howManySets,
  hasHonorInHand,
  hasHonorOrTerminalInSet
} from '../utils.js'

const {
  RIICHI,
  IPPATSU,
  DOUBLERIICHI,
  RINSHANKAIHOU,
  TSUMO,
  TANYAO,
  FANPAI,
  CHANKAN,
  HAITEI,
  HOUTEI,
  PINFU,
  IIPEIKOU,
  SANSHOKUDOUJUN,
  ITSU,
  CHANTA
} = yakuEnum

const checkHonor = (honor) => ({ pons, kans }) => pons.concat(kans).some(v => v.numbers[0] === honor)

// This is for IPK check against RPK
function hasSevenPairs(hand) {
  const dups = hand.reduce((acc, cur) => {
    if (getDuplicates(cur, hand)) {
      if (!acc[cur]) {
        acc[cur] = []
      }
      acc[cur].push(cur)
    }
    return acc
  }, {})

  return Object.values(dups).filter(v => v.length === 2).length === 7
}

export default [
  { yaku: RIICHI, han: 1, closedOnly: true, resolver({ gamestate }) { return gamestate.riichi }},
  { yaku: IPPATSU, han: 1, closedOnly: true, resolver({ gamestate }) { return gamestate.riichi && gamestate.ippatsuChance }},
  { yaku: DOUBLERIICHI, han: 1, closedOnly: true, resolver({ gamestate }) { return gamestate.doubleriichi }},
  { yaku: RINSHANKAIHOU, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.newestTileSource === 'dead wall' }},
  { yaku: TSUMO, han: 1, closedOnly: true, resolver(ctx) { return ctx.isClosedHand && ctx.gamestate.newestTileType === 'draw' }},
  { yaku: TANYAO, han: 1, closedOnly: false, resolver(ctx) { return ctx.hand.every(v => !isTerminal(v) && !isHonor(v)) }},

  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor('f')(ctx) }},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor('b')(ctx) }},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor('c')(ctx) }},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor(ctx.gamestate.seatWind)(ctx) }},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor(ctx.gamestate.roundWind)(ctx) }},

  { yaku: CHANKAN, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.newestTileType === "chankan" }},
  { yaku: HAITEI, excludes: RINSHANKAIHOU, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.wallTiles === 0 && gamestate.newestTileType === 'draw' }},
  { yaku: HOUTEI, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.wallTiles === 0 && gamestate.newestTileType === 'discard' }},

  { yaku: PINFU, han: 1, closedOnly: true, resolver(ctx) { return isPinfuHand(ctx) && ctx.waitFu === 0 }},
  { yaku: IIPEIKOU, han: 1, closedOnly: true, resolver({ chis, hand }) { 
    const checkForIdentical = (v, i, a) => a.some((av, ai) => i !== ai && v.set === av.set && v.numbers === av.numbers)
    return chis.length >= 2 && chis.some(checkForIdentical) && !hasSevenPairs(hand)
  }},

  { yaku: SANSHOKUDOUJUN, han: 1, hanClosed: 2, closedOnly: false, resolver({ hand, chis }) { 
    const chiWithIdent = chis.find((v, i, a) => 
      a.some((av, ai) => 
        i !== ai && 
        v.set !== av.set &&
        v.numbers === av.numbers
      )
    )
    return howManySets(hand) === 3 && 
      chis.length >= 3 &&
      !!chiWithIdent &&
      ['s', 'p', 'm'].every(set => chis.some(chi => 
        chi.set === set && 
        chi.numbers === chiWithIdent.numbers
      ))
  }},

  { yaku: ITSU, han: 1, hanClosed: 2, closedOnly: false, resolver({ chis }) { 
    const sets = ['123', '456', '789'].map(v => chis.find(c => c.numbers === v))
    if (sets.filter(v => v).length < 3) {
      return false
    }
    return sets.reduce((acc, cur) => acc.set === cur.set ? cur : { set: 'undefined' }).set !== 'undefined'
  }},

  { yaku: CHANTA, han: 1, hanClosed: 2, closedOnly: false, resolver({ chis, pons, kans, pairs, hand }) { 
    return chis.length >= 1 &&
      hasHonorInHand(hand) && 
      chis.every(hasHonorOrTerminalInSet) &&
      pons.every(hasHonorOrTerminalInSet) &&
      kans.every(hasHonorOrTerminalInSet) &&
      pairs.every(hasHonorOrTerminalInSet)
  }},
]
