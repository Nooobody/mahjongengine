
import { 
  howManySets, 
  hasHonorInHand, 
  isIdenticalSet
} from '../utils.js'
import yakuEnum from './enum.js'

const {
  RYANPEIKOU,
  CHINITSU,
  IIPEIKOU,
  RENHO
} = yakuEnum

export default [
  { yaku: RYANPEIKOU, han: 3, excludes: [IIPEIKOU], closedOnly: true, resolver({ chis }) {
    return chis.length === 4 && chis.every((v, i, a) => {
      return a.find((av, ai) => i !== ai && isIdenticalSet(v.tiles, av.tiles))
    })
  }},

  { yaku: CHINITSU, han: 5, hanClosed: 6, closedOnly: false, resolver(ctx) {
    return howManySets(ctx.hand) === 1 && !hasHonorInHand(ctx.hand)
  }},

  { yaku: RENHO, han: 5, resolver(ctx) {
    return false // TODO:
  }}
]
