// Shapes mirror the live API: report money arrives as strings of cents
// ("17000.0"), per-wash money as integers, and washes_daily rows have a null
// id. Getting those wrong makes the pages render NaN rather than fail loudly.

const washTypes = [
  { id: 'wt-1', name: 'Free Wash', points: 0, price: 0, cost: 0, free: true, hidden: false, insurance: false, order: 0 },
  { id: 'wt-2', name: 'Wash & Go', points: 10, price: 5000, cost: 1400, free: false, hidden: false, insurance: false, order: 1 },
  { id: 'wt-3', name: 'Wash & Dry', points: 15, price: 8000, cost: 2600, free: false, hidden: false, insurance: false, order: 2 },
  { id: 'wt-4', name: 'Full Valet', points: 40, price: 17000, cost: 6200, free: false, hidden: false, insurance: false, order: 3 },
  { id: 'wt-5', name: '24hr Rain Insurance', points: 5, price: 2000, cost: 500, free: false, hidden: false, insurance: true, order: 4 },
]

const customers = [
  { id: 'cust-1', name: 'Ada Mokoena', email: 'ada@example.test', contact_number: '0821110001', total_points: 50, loyalty_enabled: true, roles: ['customer'], vehicles: [{ id: 'v-1', registration_number: 'ABC123GP' }], washes: [] },
  { id: 'cust-2', name: 'Brian Naidoo', email: 'brian@example.test', contact_number: '0821110002', total_points: 120, loyalty_enabled: true, roles: ['customer'], vehicles: [{ id: 'v-2', registration_number: 'XYZ789GP' }], washes: [] },
  { id: 'cust-3', name: 'Chloe van Wyk', email: 'chloe@example.test', contact_number: '0821110003', total_points: 15, loyalty_enabled: false, roles: ['customer'], vehicles: [], washes: [] },
  { id: 'cust-4', name: 'Dumi Khumalo', email: 'dumi@example.test', contact_number: '0821110004', total_points: 260, loyalty_enabled: true, roles: ['customer'], vehicles: [{ id: 'v-3', registration_number: 'JKL456GP' }], washes: [] },
]

const washesReport = [
  { id: 'wt-2', name: 'Wash & Go', total_cost: '4200.0', total_price: '15000.0', wash_count: 3 },
  { id: 'wt-3', name: 'Wash & Dry', total_cost: '5200.0', total_price: '16000.0', wash_count: 2 },
  { id: 'wt-4', name: 'Full Valet', total_cost: '6200.0', total_price: '17000.0', wash_count: 1 },
  { id: 'wt-1', name: 'Free Wash', total_cost: '0.0', total_price: '0.0', wash_count: 4 },
]

const washesDaily = [
  { id: null, day: '2026-09-03', total_cost: '11400.0', total_price: '42500.0', wash_count: 9 },
  { id: null, day: '2026-09-04', total_cost: '9800.0', total_price: '38000.0', wash_count: 8 },
  { id: null, day: '2026-09-05', total_cost: '14000.0', total_price: '52500.0', wash_count: 11 },
  { id: null, day: '2026-09-06', total_cost: '15600.0', total_price: '61000.0', wash_count: 14 },
]

const washesDailyDetail = [
  { id: 'w-1', created_at: '2026-09-06T08:14:00.000Z', name: 'Ada Mokoena', email: 'ada@example.test', contact_number: '0821110001', wash_type_name: 'Wash & Go', wash_cost: 1400, wash_price: 5000 },
  { id: 'w-2', created_at: '2026-09-06T09:02:00.000Z', name: 'Brian Naidoo', email: 'brian@example.test', contact_number: '0821110002', wash_type_name: 'Full Valet', wash_cost: 6200, wash_price: 17000 },
  { id: 'w-3', created_at: '2026-09-06T11:40:00.000Z', name: 'Dumi Khumalo', email: 'dumi@example.test', contact_number: '0821110004', wash_type_name: 'Wash & Dry', wash_cost: 2600, wash_price: 8000 },
]

const insurance = [
  { id: 'ins-1', created_at: '2026-09-06T10:20:00.000Z', updated_at: '2026-09-06T10:20:00.000Z', user: customers[0], vehicles: customers[0].vehicles, wash_type: washTypes[4] },
]

const manager = {
  id: 'user-mock',
  name: 'Mock Manager',
  email: 'manager@example.test',
  contact_number: '0722041444',
  roles: ['manager', 'salesperson', 'customer'],
  authentication_token: 'mock-token',
  total_points: 0,
  loyalty_enabled: true,
  vehicles: [],
  washes: [],
}

export {
  customers,
  insurance,
  manager,
  washesDaily,
  washesDailyDetail,
  washesReport,
  washTypes,
}
