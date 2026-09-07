describe('Customer Show Page', () => {
  beforeEach(() => {
    cy.login('manager')
    cy.mockWashTypes()
  })

  it('displays customer information', () => {
    cy.mockCustomer({
      id: 'cust-123',
      name: 'John Doe',
      email: 'john@example.com',
      contact_number: '0821234567',
      total_points: 150,
      vehicles: [
        { id: 'v-1', registration_number: 'ABC123GP' },
        { id: 'v-2', registration_number: 'XYZ789GP' },
      ],
      washes: [],
    })

    cy.visit('/customers/cust-123')
    cy.wait(['@getCustomer', '@getWashTypes'])

    cy.contains('John Doe').should('exist')
    cy.contains('john@example.com').should('exist')
    cy.contains('0821234567').should('exist')
    cy.contains('150').should('exist')
    cy.contains('ABC123GP').should('exist')
  })

  it('shows "No email provided" for auto-generated emails', () => {
    cy.mockCustomer({
      email: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890@carboncarwash.co.za',
    })

    cy.visit('/customers/cust-123')
    cy.wait('@getCustomer')

    cy.contains('No email provided').should('exist')
  })

  it('displays wash history', () => {
    cy.mockCustomer({
      washes: [
        { id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' },
        { id: 'w-2', wash_type_id: 'wt-3', created_at: '2024-01-10T14:00:00Z' },
      ],
    })

    cy.visit('/customers/cust-123')
    cy.wait(['@getCustomer', '@getWashTypes'])

    // Wait for the wash type lookup to complete (component processes data after fetch)
    cy.contains('Wash & Go', { timeout: 10000 }).should('exist')
    cy.contains('Wash & Dry').should('exist')
  })

  it('has link to add new wash', () => {
    cy.mockCustomer()

    cy.visit('/customers/cust-123')
    cy.wait('@getCustomer')

    cy.contains('Add wash').should('have.attr', 'href', '/customers/cust-123/washes/new')
  })

  it('has link to reset password', () => {
    cy.mockCustomer()

    cy.visit('/customers/cust-123')
    cy.wait('@getCustomer')

    cy.contains('Reset password').should('have.attr', 'href', '/cust-123/password_reset')
  })

  it('manager can see delete wash button', () => {
    cy.login('manager')
    cy.mockCustomer({
      washes: [
        { id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' },
      ],
    })

    cy.visit('/customers/cust-123')
    cy.wait(['@getCustomer', '@getWashTypes'])

    cy.contains('Delete Wash').should('exist')
  })

  it('opens delete confirmation modal', () => {
    cy.mockCustomer({
      washes: [
        { id: 'w-1', wash_type_id: 'wt-2', created_at: '2024-01-15T10:30:00Z' },
      ],
    })

    cy.visit('/customers/cust-123')
    cy.wait(['@getCustomer', '@getWashTypes'])

    // Both the mobile card and desktop table layouts are in the DOM; only one
    // is visible at a given width.
    cy.contains('button:visible', 'Delete Wash').click()

    // Modal should appear - check for modal content instead of class
    cy.contains('Are you sure').should('exist')
  })
})
