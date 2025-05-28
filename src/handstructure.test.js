
import { handFromString } from './handfromstring'
import { buildContext } from './handstructure'

const testHand = handFromString("123m11p123456sbbb")
const testContext = {
  gamestate: undefined,
  isClosedHand: true,
  kans: [],
  possibleKans: [],
  sets: 4,
  leftOvers: [],
  hand: [ "1m", "2m", "3m", "1p", "1p", "1s", "2s", "3s", "4s", "5s", "6s", "b", "b", "b" ],
  pons: [{
    closed: true,
    numbers: "bbb",
    set: "d",
    tiles: [ "b", "b", "b" ]
  }],
  pairs: [{
    closed: true,
    numbers: "11",
    set: "p",
    tiles: [ "1p", "1p" ]
  }],
  chis: [
    { 
      closed: true,
      numbers: "123",
      set: "m",
      tiles: [ "1m", "2m", "3m" ]
    },
    { 
      closed: true,
      numbers: "123",
      set: "s",
      tiles: [ "1s", "2s", "3s" ]
    },
    { 
      closed: true,
      numbers: "456",
      set: "s",
      tiles: [ "4s", "5s", "6s" ]
    }
  ]

}

describe("handstructure", () => {
  it("can build a context from a hand", () => {
    expect(buildContext(testHand)).toStrictEqual(testContext)
  })

  it("can set the gamestate", () => {
    const ctx = { ...testContext, gamestate: { newestTile: "b", test: "asdf" } }
    expect(buildContext(testHand, { newestTile: "b", test: "asdf" })).toStrictEqual(ctx)
  })
})
