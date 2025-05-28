
import yakuEnum from './enum.js'

import { 
  howManySets, 
  hasHonorInHand,
  isHonor,
  isTerminal,
} from '../utils.js'

const {
  CHIITOITSU,
  SANSHOKUDOKOU,
  SANANKOU,
  SANKANTSU,
  TOITOI,
  HONITSU,
  SHOUSANGEN,
  HONROUTOU,
  JUNCHAN
} = yakuEnum

export default [
  { yaku: CHIITOITSU, han: 2, closedOnly: true, resolver(ctx) { return ctx.pairs.length === 7 } },

  { yaku: SANSHOKUDOKOU, han: 2, hanClosed: 3, closedOnly: false, resolver({ pons, kans, hand }) { 
    const numbers = pons.concat(kans)
    const setWithIdent = numbers.find((v, i, a) => 
      a.some((av, ai) => 
        i !== ai && 
        v.set !== av.set &&
        v.numbers[0] === av.numbers[0]
      )
    )
    return howManySets(hand) === 3 && 
      numbers.length >= 3 &&
      !!setWithIdent &&
      ['s', 'p', 'm'].every(set => numbers.some(ponkan => 
        ponkan.set === set && 
        ponkan.numbers[0] === setWithIdent.numbers[0]
      ))
  }}, 

  { yaku: SANANKOU, han: 2, closedOnly: false, resolver({ pons, kans }) { return pons.concat(kans).filter(v => v.closed).length === 3 }},

  { yaku: SANKANTSU, han: 2, closedOnly: false, resolver({ kans }) { return kans.length === 3 }},
  { yaku: TOITOI, han: 2, closedOnly: false, resolver({ pons, kans }) { return pons.length + kans.length === 4 }},
  { yaku: HONITSU, han: 2, hanClosed: 3, closedOnly: false, resolver({ hand }) { return howManySets(hand) === 1 && hasHonorInHand(hand) }},
  { yaku: SHOUSANGEN, han: 2, closedOnly: false, resolver({ pons, kans, pairs }) { 
    return pons.concat(kans).map(v => v.set === 'd').filter(v => v).length === 2 &&
      pairs[0].set === 'd'
  }},
  { yaku: HONROUTOU, han: 2, closedOnly: false, resolver(ctx) { return ctx.hand.every(v => isHonor(v) || isTerminal(v)) }},
  { yaku: JUNCHAN, han: 2, hanClosed: 3, closedOnly: false, resolver({ chis, pons, kans, pairs }) { 
    return chis.length >= 1 &&
      chis.every(v => v.tiles.some(isTerminal)) &&
      pons.every(v => v.tiles.some(isTerminal)) &&
      kans.every(v => v.tiles.some(isTerminal)) &&
      pairs.every(v => v.tiles.some(isTerminal))
  }},
]
