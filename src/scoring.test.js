
import { handFromString } from './handfromstring'
import { buildContext } from './handstructure'
import scoreHand, { BAIMAN, getBasePoints, getSeatPoints, getWaitFu, HANEMAN, MANGAN, SANBAIMAN, YAKUMAN } from './scoring.js'

const MANGAN_HANDS = {
  otherTsumo: [MANGAN, MANGAN * 2],
  otherRon: MANGAN * 4,
  eastTsumo: MANGAN * 2,
  eastRon: MANGAN * 6
}

describe("scoring", () => {

  const pointsTests = [
    {
      han: 1,
      fu: 30,
      otherTsumo: [300, 500],
      otherRon: 1000,
      eastTsumo: 500,
      eastRon: 1500
    },
    {
      han: 1,
      fu: 40,
      otherTsumo: [400, 700],
      otherRon: 1300,
      eastTsumo: 700,
      eastRon: 2000
    },
    {
      han: 1,
      fu: 50,
      otherTsumo: [400, 800],
      otherRon: 1600,
      eastTsumo: 800,
      eastRon: 2400
    },
    {
      han: 1,
      fu: 60,
      otherTsumo: [500, 1000],
      otherRon: 2000,
      eastTsumo: 1000,
      eastRon: 2900
    },
    {
      han: 1,
      fu: 70,
      otherTsumo: [600, 1200],
      otherRon: 2300,
      eastTsumo: 1200,
      eastRon: 3400
    },
    {
      han: 1,
      fu: 80,
      otherTsumo: [700, 1300],
      otherRon: 2600,
      eastTsumo: 1300,
      eastRon: 3900
    },
    {
      han: 1,
      fu: 90,
      otherTsumo: [800, 1500],
      otherRon: 2900,
      eastTsumo: 1500,
      eastRon: 4400
    },
    {
      han: 1,
      fu: 100,
      otherTsumo: [800, 1600],
      otherRon: 3200,
      eastTsumo: 1600,
      eastRon: 4800
    },
    {
      han: 2,
      fu: 20,
      otherTsumo: [400, 700],
      otherRon: null,
      eastTsumo: 700,
      eastRon: null
    },
    {
      han: 2,
      fu: 25,
      otherTsumo: null,
      otherRon: 1600,
      eastTsumo: null,
      eastRon: 2400
    },
    {
      han: 2,
      fu: 30,
      otherTsumo: [500, 1000],
      otherRon: 2000,
      eastTsumo: 1000,
      eastRon: 2900
    },
    {
      han: 2,
      fu: 40,
      otherTsumo: [700, 1300],
      otherRon: 2600,
      eastTsumo: 1300,
      eastRon: 3900
    },
    {
      han: 2,
      fu: 50,
      otherTsumo: [800, 1600],
      otherRon: 3200,
      eastTsumo: 1600,
      eastRon: 4800
    },
    {
      han: 2,
      fu: 60,
      otherTsumo: [1000, 2000],
      otherRon: 3900,
      eastTsumo: 2000,
      eastRon: 5800
    },
    {
      han: 2,
      fu: 70,
      otherTsumo: [1200, 2300],
      otherRon: 4500,
      eastTsumo: 2300,
      eastRon: 6800
    },
    {
      han: 2,
      fu: 80,
      otherTsumo: [1300, 2600],
      otherRon: 5200,
      eastTsumo: 2600,
      eastRon: 7700
    },
    {
      han: 2,
      fu: 90,
      otherTsumo: [1500, 2900],
      otherRon: 5800,
      eastTsumo: 2900,
      eastRon: 8700
    },
    {
      han: 2,
      fu: 100,
      otherTsumo: [1600, 3200],
      otherRon: 6400,
      eastTsumo: 3200,
      eastRon: 9600
    },
    {
      han: 3,
      fu: 20,
      otherTsumo: [700, 1300],
      otherRon: null,
      eastTsumo: 1300,
      eastRon: null
    },
    {
      han: 3,
      fu: 25,
      otherTsumo: [800, 1600],
      otherRon: 3200,
      eastTsumo: 1600,
      eastRon: 4800
    },
    {
      han: 3,
      fu: 30,
      otherTsumo: [1000, 2000],
      otherRon: 3900,
      eastTsumo: 2000,
      eastRon: 5800
    },
    {
      han: 3,
      fu: 40,
      otherTsumo: [1300, 2600],
      otherRon: 5200,
      eastTsumo: 2600,
      eastRon: 7700
    },
    {
      han: 3,
      fu: 50,
      otherTsumo: [1600, 3200],
      otherRon: 6400,
      eastTsumo: 3200,
      eastRon: 9600
    },
    {
      han: 3,
      fu: 60,
      otherTsumo: [2000, 3900],
      otherRon: 7700,
      eastTsumo: 3900,
      eastRon: 11600
    },
    {
      han: 3,
      fu: 70,
      ...MANGAN_HANDS
    },
    {
      han: 3,
      fu: 80,
      ...MANGAN_HANDS
    },
    {
      han: 3,
      fu: 90,
      ...MANGAN_HANDS
    },
    {
      han: 3,
      fu: 100,
      ...MANGAN_HANDS
    },
    {
      han: 4,
      fu: 20,
      otherTsumo: [1300, 2600],
      otherRon: null,
      eastTsumo: 2600,
      eastRon: null
    },
    {
      han: 4,
      fu: 25,
      otherTsumo: [1600, 3200],
      otherRon: 6400,
      eastTsumo: 3200,
      eastRon: 9600
    },
    {
      han: 4,
      fu: 30,
      otherTsumo: [2000, 3900],
      otherRon: 7700,
      eastTsumo: 3900,
      eastRon: 11600
    },
    {
      han: 4,
      fu: 40,
      ...MANGAN_HANDS
    },
    {
      han: 4,
      fu: 50,
      ...MANGAN_HANDS
    },
    {
      han: 4,
      fu: 60,
      ...MANGAN_HANDS
    },
  ]

  pointsTests.forEach(({ han, fu, otherTsumo, otherRon, eastTsumo, eastRon }) => {
    it(`scores ${han}h ${fu}fu correctly`, () => {
      const { points, eastPoints } = getBasePoints(han, fu)
      const eastTsumoPoints = getSeatPoints({ points, eastPoints, seatWind: "e", newestTileType: "draw" })
      const eastRonPoints = getSeatPoints({ points, eastPoints, seatWind: "e", newestTileType: "discard" })
      const otherTsumoPoints = getSeatPoints({ points, eastPoints, seatWind: "s", newestTileType: "draw" })
      const otherRonPoints = getSeatPoints({ points, eastPoints, seatWind: "s", newestTileType: "discard" })

      if (eastTsumo) {
        expect(eastTsumoPoints.points).toBe(eastTsumo)
      }

      if (eastRon) {
        expect(eastRonPoints.points).toBe(eastRon)
      }

      if (otherTsumo) {
        expect(otherTsumoPoints.points).toBe(otherTsumo[0])
        expect(otherTsumoPoints.eastPoints).toBe(otherTsumo[1])
      }

      if (otherRon) {
        expect(otherRonPoints.points).toBe(otherRon)
      }
    })
  })

  it("scores mangan correctly", () => {
    const { points, eastPoints } = getBasePoints(5, 20)
    expect(points).toBe(MANGAN)
  })

  it("scores haneman correctly", () => {
    const { points, eastPoints } = getBasePoints(6, 20)
    expect(points).toBe(HANEMAN)
  })

  it("scores baiman correctly", () => {
    const { points, eastPoints } = getBasePoints(8, 20)
    expect(points).toBe(BAIMAN)
  })

  it("scores sanbaiman correctly", () => {
    const { points, eastPoints } = getBasePoints(11, 20)
    expect(points).toBe(SANBAIMAN)
  })

  it("scores yakuman correctly", () => {
    const ctx = buildContext(handFromString("11123455678999p"))
    const { points } = scoreHand(ctx)
    expect(points).toBe(YAKUMAN)
  })

  it("scores fu for ryanmen", () => {
    const ctx = buildContext(handFromString("234678s345m44789p"), { newestTile: "8s" })
    expect(getWaitFu(ctx)).toBe(0)
  })

  it("scores fu for penchan", () => {
    const ctx = buildContext(handFromString("234789s345m44789p"), { newestTile: "7s" })
    expect(getWaitFu(ctx)).toBe(2)
  })

  it("scores fu for kanchan", () => {
    const ctx = buildContext(handFromString("234789s345m44789p"), { newestTile: "8s" })
    expect(getWaitFu(ctx)).toBe(2)
  })

  it("scores fu for tanki", () => {
    const ctx = buildContext(handFromString("234789s345m44789p"), { newestTile: "4p" })
    expect(getWaitFu(ctx)).toBe(2)
  })

  it("scores fu for shanpon", () => {
    const ctx = buildContext(handFromString("234456s666pww789m"), { newestTile: "6p" })
    expect(getWaitFu(ctx)).toStrictEqual(0)
  })

  it("scores fu for a Sanmenchan", () => {
    const ctx = buildContext(handFromString("234567s345m44789p"), { newestTile: "4s" })
    expect(getWaitFu(ctx)).toStrictEqual(0)
  })

  it("scores fu for a Sanmentan", () => {
    const ctx = buildContext(handFromString("23455678s345m789p"), { newestTile: "5s" })
    expect(getWaitFu(ctx)).toStrictEqual(2)
  })

})

