// Custom commands and global configuration

// Mock authenticated user for protected routes (uses sessionStorage)
Cypress.Commands.add('login', (role = 'manager') => {
  const roles = role === 'manager'
    ? ['manager', 'salesperson']
    : role === 'salesperson'
      ? ['salesperson']
      : ['customer']

  cy.window().then((win) => {
    win.sessionStorage.setItem('id', 'test-user-id')
    win.sessionStorage.setItem('email', 'test@carboncarwash.co.za')
    win.sessionStorage.setItem('token', 'test-token-123')
    win.sessionStorage.setItem('roles', JSON.stringify(roles))
  })
})

// Clear auth state
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
})

// Intercept common API calls with default responses
Cypress.Commands.add('mockWashTypes', () => {
  cy.intercept('GET', '**/api/v1/wash_types*', {
    statusCode: 200,
    body: [
      { id: 'wt-1', name: 'Free Wash', points: 0, price: 0, cost: 0, free: true, hidden: false, order: 0 },
      { id: 'wt-2', name: 'Wash & Go', points: 10, price: 5000, cost: 2000, free: false, hidden: false, order: 1 },
      { id: 'wt-3', name: 'Wash & Dry', points: 15, price: 8000, cost: 3000, free: false, hidden: false, order: 2 },
      { id: 'wt-4', name: '24hr Rain Insurance', points: 5, price: 2000, cost: 500, free: false, hidden: false, insurance: true, order: 3 },
    ],
  }).as('getWashTypes')
})

// Mock a single customer
Cypress.Commands.add('mockCustomer', (overrides = {}) => {
  const customer = {
    id: 'cust-123',
    name: 'Test Customer',
    email: 'customer@test.com',
    contact_number: '0821234567',
    total_points: 100,
    loyalty_enabled: true,
    roles: ['customer'],
    vehicles: [
      { id: 'v-1', registration_number: 'ABC123GP' },
      { id: 'v-2', registration_number: 'XYZ789GP' },
    ],
    washes: [],
    ...overrides,
  }

  cy.intercept('GET', new RegExp(`/api/v1/customers/${customer.id}(\\?.*)?$`), {
    statusCode: 200,
    body: customer,
  }).as('getCustomer')

  return cy.wrap(customer)
})

// Mock customers list
Cypress.Commands.add('mockCustomersList', () => {
  cy.intercept('GET', '**/api/v1/customers?*', {
    statusCode: 200,
    headers: { 'X-Instance-Total': '3' },
    body: [
      { id: 'cust-1', name: 'John Doe', email: 'john@test.com', contact_number: '0821111111', total_points: 50 },
      { id: 'cust-2', name: 'Jane Smith', email: 'jane@test.com', contact_number: '0822222222', total_points: 120 },
      { id: 'cust-3', name: 'No Loyalty Programme', email: 'noloyalty@carboncarwash.co.za', contact_number: '0000000001', total_points: 10450 },
    ],
  }).as('getCustomers')
})
