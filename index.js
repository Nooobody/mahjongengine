
import { 
  sortHand, 
  isHandInTenpai, 
  isHandFinished
} from './src/utils.js'
import { buildContext } from './src/handstructure.js'
import { calculateWaits } from './src/waits.js'
import scoreHand from './src/scoring.js'

function checkHand(hand, newestTile, gamestate) {

  const context = buildContext(sortHand(hand, 'ASC'), newestTile, gamestate)

  console.log("Hand:", hand)
  console.log(context)
  // console.log("Hand structure:")
  // console.log(JSON.stringify(context, null, 1))

  if (isHandFinished(context)) {
    console.log("Hand finished!")
    const points = scoreHand(context)
    console.log(points)
  }
  else if (isHandInTenpai(context)) {
    const start = performance.now()
    const waits = calculateWaits(hand)
    const end = performance.now()
    console.log("Performance (ms):", end - start)
    console.log("Hand in tenpai!")
    console.log("Waits:", waits)
  }
  else {
    // Nothing happens.
  }
}

const state = {
  roundWind: 'e',
  seatWind: 'n',
  newestTileType: 'draw',
  newestTileSource: 'dead wall',
  riichi: true,
  ippatsuChance: true,
  wallTiles: 30,
  dora: ['9s']
}

checkHand(["9s", "9s", "9s", "1s", "2s", "3s", "4s", "5s", "6s", "3m", "3m", "7p", "6p", "5p"], '6p', state)
// checkHand(['2s','2s', 'n', 'n', '4s', '4s', '6m', '6m', '9p', '9p', '1s', '1s', '2m', '2m'], '2s', state)
// checkHand(['1p','2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '2p', '8p', '2p', '7p', '6m'])
// checkHand(['8m', '8m','2s', '3s', '4s', '5s', '6s', '4p', '2p', '3p', '4p', '2p', '3p', '4s'], '3s', state)
// checkHand(['1s', '9s','1p', '9p', '1m', '9m', 'e', 's', 'w', 'n', 'c', 'f', 'f', '9m'])
