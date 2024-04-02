
import yakuEnum from './enum.js'

import { 
  isTerminal,
  isHonor,
  isPinfuHand,
  howManySets,
  hasValuePair,
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

const checkHonor = (honor) => ({ pons, kans }) => pons.concat(kans).some(v => v.numbers.includes(honor))

export default [
  { yaku: RIICHI, han: 1, closedOnly: true, resolver({ gamestate }) { return gamestate.riichi }},
  { yaku: IPPATSU, han: 1, closedOnly: true, resolver({ gamestate }) { return gamestate.riichi && gamestate.ippatsuChance }},
  { yaku: DOUBLERIICHI, han: 1, closedOnly: true, resolver({ gamestate }) { return gamestate.doubleriichi }},
  { yaku: RINSHANKAIHOU, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.newestTileSource === 'dead wall' }},
  { yaku: TSUMO, han: 1, closedOnly: true, resolver(ctx) { return ctx.isClosedHand && ctx.gamestate.newestTileType === 'draw' }},
  { yaku: TANYAO, han: 1, closedOnly: false, resolver(ctx) { return ctx.hand.every(v => !isTerminal(v) && !isHonor(v)) }},

  { yaku: FANPAI, han: 1, closedOnly: false, resolver: checkHonor('f')},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver: checkHonor('b')},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver: checkHonor('c')},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor(ctx.gamestate.seatWind)(ctx) }},
  { yaku: FANPAI, han: 1, closedOnly: false, resolver(ctx) { return checkHonor(ctx.gamestate.roundWind)(ctx) }},

  { yaku: CHANKAN, han: 1, closedOnly: false, resolver(ctx) { return false }}, // TODO:
  { yaku: HAITEI, excludes: RINSHANKAIHOU, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.wallTiles === 0 && gamestate.newestTileType === 'draw' }},
  { yaku: HOUTEI, han: 1, closedOnly: false, resolver({ gamestate }) { return gamestate.wallTiles === 0 && gamestate.newestTileType === 'discard' }},

  { yaku: PINFU, han: 1, closedOnly: true, resolver(ctx) { return isPinfuHand(ctx) && ctx.waitFu === 0 }},
  { yaku: IIPEIKOU, han: 1, closedOnly: true, resolver({ chis }) { 
    return chis.length >= 2 && chis.find((v, i, a) => a.find((av, ai) => i !== ai && v.set === av.set && v.numbers === av.numbers))
  }},

  { yaku: SANSHOKUDOUJUN, han: 1, hanClosed: 2, closedOnly: false, resolver({ hand, chis }) { 
    const chiWithIdent = chis.find((v, i, a) => 
      a.find((av, ai) => 
        i !== ai && 
        v.set !== av.set &&
        v.numbers === av.numbers
      )
    )
    return howManySets(hand) === 3 && 
      chis.length >= 3 &&
      chiWithIdent &&
      ['s', 'p', 'm'].every(set => chis.find(chi => 
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

  { yaku: CHANTA, han: 1, hanClosed: 2, closedOnly: false, resolver({ chis, pons, kans, pairs }) { 
    return chis.length >= 1 &&
      chis.every(hasHonorOrTerminalInSet) &&
      pons.every(hasHonorOrTerminalInSet) &&
      kans.every(hasHonorOrTerminalInSet) &&
      pairs.every(hasHonorOrTerminalInSet)
  }},
]
