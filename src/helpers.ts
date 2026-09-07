// Matches what numeral's '$0.00' produced: no thousands separator, a dot
// decimal, and the sign outside the symbol. en-ZA would render R1 234,56.
const amount = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
})

export const formatRands = (rands) =>
  `${rands < 0 ? '-' : ''}R${amount.format(Math.abs(rands))}`

export const centsToRands = (cents) => cents / 100

export const transformCentsToRands = (input) => formatRands(centsToRands(input))

export const transformWashesCentsToRands = (washes) =>
  washes.map((wash) => {
    wash.cost = formatRands(centsToRands(wash.cost))
    wash.price = formatRands(centsToRands(wash.price))
    return wash
  })

export const handleDownload = async (res, filename) => {
  const url = window.URL.createObjectURL(new Blob([res]))
  const link = document.createElement('a')
  link.href = url
  const today = new Date()
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  link.setAttribute('download', `${filename}-${date}.csv`)
  link.click()
}
