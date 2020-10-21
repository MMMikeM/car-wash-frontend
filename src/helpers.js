var numeral = require('numeral')

numeral.register('locale', 'za', {
  delimiters: {
    thousands: ' ',
    decimal: '.',
  },
  currency: {
    symbol: 'R',
  },
})
numeral.locale('za')

export const transformCentsToRands = (input) => {
  let transformed = numeral(centsToRands(input)).format('$0.00')

  return transformed
}

export const transformWashesCentsToRands = (washes) => {
  let transformed = washes.map((wash) => {
    wash.cost = numeral(centsToRands(wash.cost)).format('$0.00')
    wash.price = numeral(centsToRands(wash.price)).format('$0.00')
    return wash
  })
  return transformed
}

export const centsToRands = (rands) => {
  return rands / 100
}

export const formatRands = (rands) => numeral(rands).format('$0.00')

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
