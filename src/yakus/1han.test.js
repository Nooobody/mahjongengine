
import yakuEnum from './enum.js'
import YAKUS from './1han.js'
import { buildContext } from '../handstructure.js'
import { handFromString } from '../handfromstring.js'
import { getWaitFu } from '../scoring.js'

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

const testHands = {
  [RIICHI]: {
    true: { gamestate: { riichi: true }},
    false: { gamestate: { riichi: false }}
  },
  [IPPATSU]: {
    true: { gamestate: { riichi: true, ippatsuChance: true }},
    false: { gamestate: { riichi: true, ippatsuChance: false }}
  },
  [DOUBLERIICHI]: {
    true: { gamestate: { doubleriichi: true }},
    false: { gamestate: { doubleriichi: false }},
  },
  [RINSHANKAIHOU]: {
    true: { gamestate: { newestTileSource: "dead wall" }},
    false: [{ gamestate: { newestTileSource: "wall" }}, { gamestate: { newestTileSource: "player" }}],
  },
  [TSUMO]: {
    true: { isClosedHand: true, gamestate: { newestTileType: "draw" }},
    false: [{ isClosedHand: false, gamestate: { newestTileType: "draw" }}, { isClosedHand: true, gamestate: { newestTileType: "call" }}],
  },
  [TANYAO]: {
    true: [ 
      { hand: "234567s444p33678m" },
      { hand: "23455678s345m456p" },
    ],
    false: { hand: "123456s123p78944m" }
  },
  [CHANKAN]: {
    true: { gamestate: { newestTileType: "chankan" }},
    false: { gamestate: { newestTileType: "draw" }}
  },
  [HAITEI]: {
    true: { hand: "123123123s345p77m", gamestate: { wallTiles: 0, newestTileType: "draw" }},
    false: [
      { hand: "123123123s345p77m", gamestate: { wallTiles: 0, newestTileType: "discard" }},
      { hand: "123123123s345p77m", gamestate: { wallTiles: 1, newestTileType: "draw" }}
    ]
  },
  [HOUTEI]: {
    true: { hand: "123123123s345p77m", gamestate: { wallTiles: 0, newestTileType: "discard" }},
    false: [
      { hand: "123123123s345p77m", gamestate: { wallTiles: 0, newestTileType: "draw" }},
      { hand: "123123123s345p77m", gamestate: { wallTiles: 1, newestTileType: "discard" }},
    ]
  },
  [PINFU]: {
    true: [
      { hand: "234234p44m234567s", gamestate: { newestTile: "7s", roundWind: "e", seatWind: "w" } },
      { hand: "234234p44m234567s", gamestate: { newestTile: "5s", roundWind: "e", seatWind: "w" } },
      { hand: "234234p44m234567s", gamestate: { newestTile: "2s", roundWind: "e", seatWind: "w" } },
      { hand: "234234p44m234567s", gamestate: { newestTile: "2p", roundWind: "e", seatWind: "w" } },
      { hand: "234234pnn234567s", gamestate: { newestTile: "7s", roundWind: "e", seatWind: "w" } },
      { hand: "789789s34555m123p", gamestate: { newestTile: "3m", roundWind: "e", seatWind: "w" } },
      { hand: "789789s45556m123p", gamestate: { newestTile: "6m", roundWind: "e", seatWind: "w" } },
    ],
    false: [
      { hand: "234234p44m234567s", gamestate: { newestTile: "4m", roundWind: "e", seatWind: "w" } },
      { hand: "234234p44m234567s", gamestate: { newestTile: "3p", roundWind: "e", seatWind: "w" } },
      { hand: "234789p44m234567s", gamestate: { newestTile: "7p", roundWind: "e", seatWind: "w" } },
      { hand: "234234p444m33567s", gamestate: { newestTile: "7m", roundWind: "e", seatWind: "w" } },
      { hand: "789789s44555m123p", gamestate: { newestTile: "4m", roundWind: "e", seatWind: "w" } },
      { hand: "234234pcc234567s", gamestate: { newestTile: "7s", roundWind: "e", seatWind: "w" } },
      { hand: "234234pee234567s", gamestate: { newestTile: "7s", roundWind: "e", seatWind: "w" } },
      { hand: "234234pww234567s", gamestate: { newestTile: "7s", roundWind: "e", seatWind: "w" } },
    ]
  },
  [IIPEIKOU]: {
    true: { hand: "234234s444p12355m" },
    false: [
      { hand: "234345s44455123m" },
      { hand: "234234m345345p22s" },
    ]
  },
  [SANSHOKUDOUJUN]: {
    true: [ 
      { hand: "123s123m12355678p" },
      { hand: "789s789m789pcceee" },
      { hand: "23444s234234m234p" },
    ],
    false: [ 
      { hand: "234s345m123567pww" },
      { hand: "234s345m123123pww" },
      { hand: "333p444m555swwwcc" },
      { hand: "123456234seeccc" },
      { hand: "234345s456123mww" },
    ]
  },
  [ITSU]: {
    true: { hand: "123456789s33p444m" },
    false: { hand: "234345456s33m444p" }
  },
  [CHANTA]: {
    true: [ 
      { hand: "123789s123meeccc" },
      { hand: "123789s12399mwww" },
    ],
    false: [
      { hand: "123678s123m123pcc"},
      { hand: "111123789s123m123p" }
    ]
  }
}

const fanpaiTests = {
    true: [ 
      { hand: "123456s123pfff44m", gamestate: { roundWind: "e", seatWind: "e" } },
      { hand: "123456sbbb543m22p", gamestate: { roundWind: "e", seatWind: "e" } }, 
      { hand: "ccc234s456789m99p", gamestate: { roundWind: "e", seatWind: "e" } }, 
      { hand: "eeee123s123m11456p", gamestate: { roundWind: "e", seatWind: "n" } }, 
      { hand: "334455swww23455p", gamestate: { roundWind: "e", seatWind: "w" } } 
    ],
    false: [ 
      { hand: "123123s234234p77m", gamestate: { roundWind: "e", seatWind: "w" } },
      { hand: "123123s234234pcc", gamestate: { roundWind: "e", seatWind: "w" } } 
  ]
}

describe("1han yakus", () => {
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

          if (yaku === PINFU) {
            testCase.waitFu = getWaitFu(testCase)
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

          if (yaku === PINFU) {
            testCase.waitFu = getWaitFu(testCase)
          }

          if (debug) {
            console.log(testCase)
          }

          expect(resolver(testCase)).toBe(false);
        }))
      }
    }
  })

  const fanpais = YAKUS.filter(v => v.yaku === FANPAI)

  fanpaiTests.true.forEach(({ hand, gamestate }) => {
    const ctx = buildContext(handFromString(hand), gamestate)

    it("Scores Fanpai correctly", () => {
      expect(fanpais.some(({ resolver }) => resolver(ctx))).toBe(true)
    })
  })

  fanpaiTests.false.forEach(({ hand, gamestate }) => {
    const ctx = buildContext(handFromString(hand), gamestate)

    it("Skips Fanpai correctly", () => {
      expect(fanpais.some(({ resolver }) => resolver(ctx))).toBe(false)
    })
  })
})
