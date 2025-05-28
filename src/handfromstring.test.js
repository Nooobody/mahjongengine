
import { handFromString } from './handfromstring'

const testHand = [
  "123m111456pffwww",
  [ "1m", "2m", "3m", "1p", "1p", "1p", "4p", "5p", "6p", "f", "f", "w", "w", "w"]
]

const testHand2 = [
  "1231114569934p",
  [ "1p", "2p", "3p", "1p", "1p", "1p", "4p", "5p", "6p", "9p", "9p", "3p", "4p"]
]

describe("handFromString", () => {
  it("can build a hand from a string", () => {
    const hand = handFromString(testHand[0])
    expect(hand).toStrictEqual(testHand[1])
  })

  it("can build a hand from a string with only one set", () => {
    const hand = handFromString(testHand2[0])
    expect(hand).toStrictEqual(testHand2[1])
  })
})

