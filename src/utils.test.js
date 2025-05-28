import { handFromString } from "./handfromstring"
import { sortHand } from "./utils"

describe("sortHand", () => {

  const testHand = ["1p", "4p", "5p", "2p", "9p", "6p", "c", "c", "4m", "5m", "6m", "1p", "3p"]

  it("sorts hand by ascending", () => {
    expect(sortHand(testHand, "ASC")).toStrictEqual(handFromString("456m11234569pcc"))
  })

  it("sorts hand by descending", () => {
    expect(sortHand(testHand, "DESC")).toStrictEqual(handFromString("cc96543211p654m"))
  })

  it("sorts hand by alternating numbers", () => {
    expect(sortHand(testHand, "MIXED")).toStrictEqual(handFromString("19162534p465mcc"))
  })
})
