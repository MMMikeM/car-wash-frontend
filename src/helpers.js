export const transformWashesCentsToRands = (washes) => {
  let transformed = washes.map((wash) => {
    wash.cost = centsToRands(wash.cost)
    wash.price = centsToRands(wash.price)
    return wash
  })

  return transformed
}

export const centsToRands = (rands) => { return (rands / 100) }
