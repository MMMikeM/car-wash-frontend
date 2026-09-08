// No thousands separator, a dot decimal, and the sign outside the symbol -
// what this app has always displayed. Real en-ZA renders R1 234,56.
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
  washes.map((wash) => ({
    ...wash,
    cost: formatRands(centsToRands(wash.cost)),
    price: formatRands(centsToRands(wash.price)),
  }))

export const sumReportTotal = (rows) =>
  formatRands(
    centsToRands(
      rows.reduce((total, row) => total + parseFloat(row.total_price), 0)
    )
  )

export const formatReportMoney = (rows) =>
  rows.map((row) => ({
    ...row,
    total_cost: formatRands(centsToRands(row.total_cost)),
    total_price: formatRands(centsToRands(row.total_price)),
  }))

/**
 * Sign-ups without an email get a generated `<uuid>@carboncarwash.co.za`
 * address. No `g` flag: `test()` on a global regex advances `lastIndex`, so a
 * shared instance would alternate true/false between calls.
 */
const ANONYMOUS_EMAIL =
  /[\d|a-f]{8}\b-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-\b[\d|a-f]{12}\b@carboncarwash.co.za/

export const isAnonymousEmail = (email) => ANONYMOUS_EMAIL.test(email)

const pad = (value: number) => String(value).padStart(2, '0')

/** `YYYY-MM-DD` in local time, which is what the report filters send. */
export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** `YYYY-MM-DD HH:mm:ss`. */
export const formatDateTime = (date: Date) =>
  `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

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
