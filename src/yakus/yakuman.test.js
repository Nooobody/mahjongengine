
import yakuEnum from './enum.js'
import YAKUS from './yakuman.js'
import { buildContext } from '../handstructure.js'
import { handFromString } from '../handfromstring.js'

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

const testHands = {
  [KOKUSHIMUSOU]: {
    true: { hand: "19s19m19pnewscfbb" }
  },
  [CHUURENPOOTO]: {
    true: { hand: "11123456789995s" },
    false: { hand: "11123445678889s" }
  },
  [SUUANKOU]: {
    true: { hand: "111333555777s99p" }
  },
  [SUUKANTSU]: {
    true: { hand: "1111333355557777s99p" }
  },
  [RYUUIISOU]: {
    true: { hand: "222333444666sff" }
  },
  [CHINROUTO]: {
    true: { hand: "111999s111999p99m" }
  },
  [TSUUIISOU]: {
    true: { hand: "fffcccwwwsssnn" }
  },
  [DAISANGEN]: {
    true: { hand: "fffcccbbb123s99p" }
  },
  [SHOUSUUSHII]: {
    true: { hand: "nnneeewwwss123s" }
  },
  [DAISUUSHII]: {
    true: { hand: "nnneeewwwsss99p" }
  }
}

describe("Yakumans", () => {
  YAKUS.forEach(({ yaku, resolver }) => {
    if (testHands[yaku]) {
      const cases = testHands[yaku]
      if (cases.true) {
        const trueCases = Array.isArray(cases.true) ? cases.true : [cases.true]
        trueCases.forEach(testCase => it(`Scores ${yaku} correctly`, () => {
          const debug = testCase.debug
          if (testCase.hand) {
            testCase = buildContext(handFromString(testCase.hand), testCase.gamestate)
          }

          if (debug) {
            console.log(testCase)
          }

          expect(resolver(testCase)).toBe(true);
        }))
      }

      if (cases.false) {
        const falseCases = Array.isArray(cases.false) ? cases.false : [cases.false]
        falseCases.forEach(testCase => it(`Skips ${yaku} correctly`, () => {
          const debug = testCase.debug
          if (testCase.hand) {
            testCase = buildContext(handFromString(testCase.hand), testCase.gamestate)
          }

          if (debug) {
            console.log(testCase)
          }

          expect(resolver(testCase)).toBe(false);
        }))
      }
    }
  })
})
