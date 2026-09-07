// Screenshot capture for UI analysis - mobile first
describe('UI Screenshots - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x') // 375x812
  })

  describe('Public Pages', () => {
    it('Login page', () => {
      cy.visit('/login')
      cy.wait(500)
      cy.screenshot('mobile/01-login')
    })

    it('Sign up page', () => {
      cy.visit('/sign_up')
      cy.wait(500)
      cy.screenshot('mobile/02-signup')
    })

    it('Forgot password page', () => {
      cy.visit('/forgot_password')
      cy.wait(500)
      cy.screenshot('mobile/03-forgot-password')
    })
  })

  describe('Manager Views', () => {
    beforeEach(() => {
      cy.login('manager')
      cy.mockWashTypes()
      cy.mockCustomersList()
    })

    it('Customers list', () => {
      cy.visit('/customers')
      cy.wait('@getCustomers')
      cy.wait(500)
      cy.screenshot('mobile/04-customers-list')
    })

    it('Customer detail', () => {
      cy.mockCustomer({
        id: 'cust-1',
        name: 'John Doe',
        email: 'john@example.com',
        contact_number: '0821234567',
        total_points: 150,
        loyalty_enabled: true,
        vehicles: [
          { id: 'v-1', registration_number: 'ABC123GP' },
          { id: 'v-2', registration_number: 'XYZ789GP' },
        ],
        washes: [
          { id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' },
          { id: 'w-2', wash_type_id: 'wt-3', created_at: '2024-01-10T14:00:00Z' },
        ],
      })

      cy.visit('/customers/cust-1')
      cy.wait(['@getCustomer', '@getWashTypes'])
      cy.wait(500)
      cy.screenshot('mobile/05-customer-detail')
    })

    it('Customer edit', () => {
      cy.mockCustomer({
        id: 'cust-1',
        name: 'John Doe',
        email: 'john@example.com',
        contact_number: '0821234567',
        total_points: 150,
        loyalty_enabled: true,
      })

      cy.visit('/customers/cust-1/edit')
      cy.wait('@getCustomer')
      cy.wait(500)
      cy.screenshot('mobile/06-customer-edit')
    })

    it('Customer search', () => {
      cy.intercept('GET', '**/api/v1/customers?*', {
        statusCode: 200,
        headers: { 'X-Instance-Total': '0' },
        body: [],
      }).as('searchCustomers')

      cy.visit('/customers/search')
      cy.wait(500)
      cy.screenshot('mobile/07-customer-search')
    })
  })

  describe('Sales Flow', () => {
    beforeEach(() => {
      cy.login('salesperson')
      cy.mockWashTypes()
    })

    it('Add wash page', () => {
      cy.mockCustomer({
        id: 'cust-1',
        name: 'John Doe',
        total_points: 150,
        vehicles: [{ id: 'v-1', registration_number: 'ABC123GP' }],
        washes: [],
      })

      cy.visit('/customers/cust-1/washes/new')
      cy.wait(['@getCustomer', '@getWashTypes'])
      cy.wait(500)
      cy.screenshot('mobile/08-add-wash')
    })
  })

  describe('Settings', () => {
    beforeEach(() => {
      cy.login('manager')
      cy.mockWashTypes()
    })

    it('Wash types list', () => {
      cy.visit('/wash_types')
      cy.wait('@getWashTypes')
      cy.wait(500)
      cy.screenshot('mobile/09-wash-types-list')
    })

    it('Wash type detail', () => {
      cy.intercept('GET', '**/api/v1/wash_types/wt-2', {
        statusCode: 200,
        body: {
          id: 'wt-2',
          name: 'Wash & Go',
          points: 10,
          price: 5000,
          cost: 2000,
          description: 'Quick exterior wash',
          order: 1,
        },
      }).as('getWashType')

      cy.visit('/wash_types/wt-2')
      cy.wait('@getWashType')
      cy.wait(500)
      cy.screenshot('mobile/10-wash-type-detail')
    })

    it('Wash type edit', () => {
      cy.intercept('GET', '**/api/v1/wash_types/wt-2', {
        statusCode: 200,
        body: {
          id: 'wt-2',
          name: 'Wash & Go',
          points: 10,
          price: 5000,
          cost: 2000,
          description: 'Quick exterior wash',
          order: 1,
        },
      }).as('getWashType')

      cy.visit('/wash_types/wt-2/edit')
      cy.wait('@getWashType')
      cy.wait(500)
      cy.screenshot('mobile/11-wash-type-edit')
    })

    it('Wash type new', () => {
      cy.visit('/wash_types/new')
      cy.wait(500)
      cy.screenshot('mobile/12-wash-type-new')
    })
  })
})
