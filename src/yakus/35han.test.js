
import yakuEnum from './enum.js'
import YAKUS from './35han.js'
import { buildContext } from '../handstructure.js'
import { handFromString } from '../handfromstring.js'

const {
  RYANPEIKOU,
  CHINITSU,
  RENHO // TODO:
} = yakuEnum

const testHands = {
  [RYANPEIKOU]: {
    true: { hand: "123123s345345m99p" },
    false: [
      { hand: "123123s345678m99p" },
      { hand: "112233445588s33m" },
    ]
  },
  [CHINITSU]: {
    true: { hand: "12323434545656799s" },
    false: [
      { hand: "234345456567scc" },
      { hand: "234345456567s99p" }
    ]
  }
}

describe("35han yakus", () => {
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
