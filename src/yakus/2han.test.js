
import yakuEnum from './enum.js'
import YAKUS from './2han.js'
import { buildContext } from '../handstructure.js'
import { handFromString } from '../handfromstring.js'

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

const testHands = {
  [CHIITOITSU]: {
    true: { hand: "1133557799s44mcc" },
    false: [ 
      { hand: "123456s234m56799p" },
      { hand: "112233s112233m99p" }
    ]
  },
  [SANSHOKUDOKOU]: {
    true: [
      { hand: "111s111m111345pww" },
      { hand: "345111s111m111pww" },
      { hand: "444111s111m111pww" },
      { hand: "111s111m111pwwccc" },
      { hand: "111s111m111444pww" },
    ],
    false: { hand: "111s111m222345pww" }
  },
  [SANANKOU]: {
    true: { hand: "222444666s345mww" },
    false: { hand: "111s333m234456pww" }
  },
  [SANKANTSU]: {
    true: { hand: "111144447777s23477m" },
    false: { hand: "11114444s123345m44p" }
  },
  [TOITOI]: {
    true: [ 
      { hand: "11122244455588s" },
      { hand: "11112222444455588s" }
    ],
    false: { hand: "111333555s345m77p" }
  },
  [HONITSU]: {
    true: { hand: "123345456567mww" },
    false: [
      { hand: "123234s345456m77p" },
      { hand: "23434545656767899p" }
    ]
  },
  [SHOUSANGEN]: {
    true: { hand: "cccfffbb23499s" },
    false: [
      { hand: "cccfff123123s99p" },
      { hand: "cccfffbbb12399p" }
    ]
  },
  [HONROUTOU]: {
    true: { hand: "111999s111mcccww" },
    false: { hand: "123999s111mcccww" }
  },
  [JUNCHAN]: {
    true: { hand: "123789s123789m99p" },
    false: [
      { hand: "123789s123789mww" },
      { hand: "123789s12378889m" },
    ]
  }
}

describe("2han yakus", () => {
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
