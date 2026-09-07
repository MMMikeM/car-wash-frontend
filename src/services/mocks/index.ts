import {
  customers,
  insurance,
  manager,
  washesDaily,
  washesDailyDetail,
  washesReport,
  washTypes,
} from './fixtures'

const json = (body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...headers },
  })

const csv = (rows: string[][]) =>
  new Response(rows.map((row) => row.join(',')).join('\n'), {
    status: 200,
    headers: { 'Content-Type': 'text/csv' },
  })

const routes: [RegExp, (match: RegExpMatchArray) => Response][] = [
  [/^\/sign_in/, () => json({ is_success: true, messages: '', data: { user: manager } })],

  [/^\/reports\/washes_report\.csv/, () =>
    csv([
      ['Wash Type', 'Count', 'Cost', 'Price'],
      ...washesReport.map((r) => [r.name, String(r.wash_count), r.total_cost, r.total_price]),
    ])],
  [/^\/reports\/washes_report/, () => json(washesReport)],
  [/^\/reports\/washes_daily_detail/, () => json(washesDailyDetail)],
  [/^\/reports\/washes_daily/, () => json(washesDaily)],
  [/^\/reports\/insurance/, () => json(insurance)],
  [/^\/reports\/user_washes/, () => json(customers)],
  [/^\/reports\/active_users/, () => json(customers)],

  [/^\/wash_types\/([\w-]+)/, (match) =>
    json(washTypes.find((type) => type.id === match[1]) ?? washTypes[0])],
  [/^\/wash_types/, () => json(washTypes)],

  [/^\/customers\/([\w-]+)$/, (match) =>
    json(customers.find((customer) => customer.id === match[1]) ?? customers[0])],
  [/^\/customers/, () =>
    json(customers, { 'X-Instance-Total': String(customers.length) })],
]

export const mockRequest = (method: string, path: string): Response | null => {
  for (const [pattern, respond] of routes) {
    const match = path.match(pattern)
    if (match) {
      console.info(`[mock api] ${method} ${path}`)
      return respond(match)
    }
  }

  console.warn(`[mock api] no fixture for ${method} ${path}`)
  return null
}
