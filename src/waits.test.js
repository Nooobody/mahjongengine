
import { calculateWaits, getWaits } from './waits.js'
import { handFromString } from './handfromstring.js'

describe("getWaits", () => {
  it("get waits for a ryanmen", () => {
    const waits = getWaits(handFromString("23467s345m44789p"))
    expect(waits).toStrictEqual(["5s", "8s"])
  })

  it("get waits for a tanki", () => {
    const waits = getWaits(handFromString("234678s345m4789p"))
    expect(waits).toStrictEqual(["4p"])
  })

  it("get waits for a penchan", () => {
    const waits = getWaits(handFromString("234678s345m4489p"))
    expect(waits).toStrictEqual(["7p"])
  })

  it("get waits for a kanchan", () => {
    const waits = getWaits(handFromString("234678s345m4479p"))
    expect(waits).toStrictEqual(["8p"])
  })

  it("get waits for a nobetan", () => {
    const waits = getWaits(handFromString("234456s666p6789m"))
    expect(waits).toStrictEqual(["6m", "9m"])
  })

  it("get waits for a Shanpon", () => {
    const waits = getWaits(handFromString("234456s66pww789m"))
    expect(waits).toStrictEqual(["6p", "w"])
  })

  it("get waits for an Entotsu", () => {
    const waits = getWaits(handFromString("234s66654pww789m"))
    expect(waits).toStrictEqual(["3p", "6p", "w"])
  })

  it("get waits for a Sanmenchan", () => {
    const waits = getWaits(handFromString("23456s345m44789p"))
    expect(waits).toStrictEqual(["1s", "4s", "7s"])
  })

  it("get waits for a Sanmentan", () => {
    const waits = getWaits(handFromString("2345678s345m456p"))
    expect(waits).toStrictEqual(["2s", "5s", "8s"])
  })

  it("get waits for a Aryanmen", () => {
    const waits = getWaits(handFromString("234456s4566p789m"))
    expect(waits).toStrictEqual(["3p", "6p"])
  })

  it("get waits for a Ryantan", () => {
    const waits = getWaits(handFromString("234456s5666p789m"))
    expect(waits).toStrictEqual(["4p", "5p", "7p"])
  })

  it("get waits for a Pentan", () => {
    const waits = getWaits(handFromString("234456s1222p789m"))
    expect(waits).toStrictEqual(["1p", "3p"])
  })

  it("get waits for a Kantan", () => {
    const waits = getWaits(handFromString("234456s5777p789m"))
    expect(waits).toStrictEqual(["5p", "6p"])
  })

  it("get waits for a Kantankan", () => {
    const waits = getWaits(handFromString("234456s3335777p"))
    expect(waits).toStrictEqual(["4p", "5p", "6p"])
  })

  it("get waits for a Tatsumaki", () => {
    const waits = getWaits(handFromString("234456s6667888p"))
    expect(waits).toStrictEqual(["5p", "6p", "7p", "8p", "9p"])
  })

  it("get waits for a Happoubijin", () => {
    const waits = getWaits(handFromString("234s2223456777p"))
    expect(waits).toStrictEqual(["1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p"])
  })
})

