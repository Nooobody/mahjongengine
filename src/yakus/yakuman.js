
import {
  isTerminal,
  isHonor,
  isWind,
  isThirteenOrphans,
  howManySets
} from '../utils.js'

import yakuEnum from './enum.js'

const {
  KOKUSHIMUSOU,
  CHUURENPOOTO,
  TENHO,
  CHIHO,
  SUUANKOU,
  SUUKANTSU,
  RYUUIISOU,
  CHINROUTO,
  TSUUIISOU,
  DAISANGEN,
  SHOUSUUSHII,
  DAISUUSHII
} = yakuEnum

export default [
  { yaku: KOKUSHIMUSOU, closedOnly: true, resolver(ctx) {
    return isThirteenOrphans(ctx)
  }},

  { yaku: CHUURENPOOTO, closedOnly: true, resolver({ hand }) {
    const tiles = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9]
    let tempHand = hand.slice()
    return howManySets(hand) === 1 && tiles.every(t => {
      const foundInd = tempHand.findIndex(v => parseInt(v[0]) === t)
      tempHand = tempHand.filter((v, i) => i !== foundInd)
      return foundInd !== -1
    })
  }},

  { yaku: TENHO, closedOnly: true, resolver(ctx) {
    // TODO: Kans not allowed
  }},

  { yaku: CHIHO, closedOnly: true, resolver(ctx) {
    // TODO: Kans not allowed
  }},

  { yaku: SUUANKOU, closedOnly: false, resolver({ pons, kans }) {
    const numbers = pons.concat(kans)
    return numbers.filter(v => v.closed).length === 4
    // TODO: Ron on discard allowed only on pair
  }},

  { yaku: SUUKANTSU, closedOnly: false, resolver({ kans }) {
    return kans.length === 4
  }},

  { yaku: RYUUIISOU, closedOnly: false, resolver({ hand }) {
    const greens = ['2s', '3s', '4s', '6s', '8s', 'f']
    return hand.every(v => greens.includes(v))
  }},

  { yaku: CHINROUTO, closedOnly: false, resolver({ hand }) {
    return hand.every(v => isTerminal(v))
  }},

  { yaku: TSUUIISOU, closedOnly: false, resolver({ hand }) {
    return hand.every(v => isHonor(v))
  }},

  { yaku: DAISANGEN, closedOnly: false, resolver({ pons, kans }) {
    const numbers = pons.concat(kans)
    return ['f', 'c', 'b'].every(v => numbers.some(n => n.numbers[0] === v))
  }},

  { yaku: SHOUSUUSHII, closedOnly: false, resolver({ pons, kans, pairs }) {
    return pairs[0].set === 'w' &&
       pons.concat(kans).reduce((acc, cur) => isWind(cur.tiles[0]) ? acc + 1 : acc, 0) === 3
  }}, 

  { yaku: DAISUUSHII, closedOnly: false, resolver({ pons, kans }) {
    const numbers = pons.concat(kans)
    return ['e', 's', 'w', 'n'].every(v => numbers.some(n => n.numbers[0] === v))
  }}
]
