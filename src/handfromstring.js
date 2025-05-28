
export function handFromString(hand) {

  const split = hand.split("").reduce((acc, cur) => {
    if (acc.length === 0) {
      acc.push([])
    }

    acc.at(-1).push(cur)
    if (Number.isNaN(parseInt(cur))) {
      acc.push([])
    }

    return acc
  }, [])

  const convertedHand = split.map(numbers => {
    if (numbers.length === 1) {
      return numbers[0]
    }

    const set = numbers.at(-1);
    const tiles = numbers.map(v => !Number.isNaN(parseInt(v)) ? v + set : null).filter(v => !!v)
    return tiles;
  }).flat();

  return convertedHand
}
