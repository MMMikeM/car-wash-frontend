describe('Customer Edit', () => {
  beforeEach(() => {
    cy.login('manager')
    cy.mockWashTypes()
  })

  it('loads customer data into form', () => {
    cy.mockCustomer({
      id: 'cust-123',
      name: 'Test Customer',
      email: 'test@example.com',
      contact_number: '0821234567',
      total_points: 100,
      loyalty_enabled: true,
    })

    cy.visit('/customers/cust-123/edit')
    cy.wait('@getCustomer')

    // Verify form is populated
    cy.get('input').eq(0).should('have.value', 'Test Customer')
    cy.get('input').eq(1).should('have.value', 'test@example.com')
    cy.get('input').eq(2).should('have.value', '0821234567')
    cy.get('input').eq(3).should('have.value', '100')
  })

  it('shows loyalty_enabled checkbox', () => {
    cy.mockCustomer({ loyalty_enabled: true })

    cy.visit('/customers/cust-123/edit')
    cy.wait('@getCustomer')

    cy.get('input[type="checkbox"]').should('be.checked')
    cy.contains('Loyalty enabled').should('exist')
  })

  it('saves customer WITHOUT sending vehicles (fixes 413 error)', () => {
    // Customer with many vehicles (simulating No Loyalty user)
    const manyVehicles = Array(100).fill(null).map((_, i) => ({
      id: `v-${i}`,
      registration_number: `TEST${i}GP`,
    }))

    cy.mockCustomer({
      id: 'cust-noloyalty',
      name: 'No Loyalty Programme',
      email: 'noloyalty@carboncarwash.co.za',
      contact_number: '0000000001',
      total_points: 10450,
      loyalty_enabled: true,
      vehicles: manyVehicles,
    })

    // Intercept the PUT and verify payload
    cy.intercept('PUT', '**/api/v1/customers/cust-noloyalty', (req) => {
      // CRITICAL: Verify vehicles are NOT in the payload
      expect(req.body).to.not.have.property('vehicles')
      expect(req.body).to.not.have.property('washes')
      expect(req.body).to.not.have.property('roles')

      // Verify only editable fields are sent
      expect(req.body).to.have.property('name')
      expect(req.body).to.have.property('email')
      expect(req.body).to.have.property('contact_number')
      expect(req.body).to.have.property('total_points')
      expect(req.body).to.have.property('loyalty_enabled')

      req.reply({
        statusCode: 200,
        body: { id: 'cust-noloyalty', ...req.body },
      })
    }).as('saveCustomer')

    cy.visit('/customers/cust-noloyalty/edit')
    cy.wait('@getCustomer')

    // Change total_points to 0
    cy.get('input').eq(3).clear().type('0')

    // Uncheck loyalty
    cy.get('input[type="checkbox"]').uncheck()

    // Save
    cy.contains('button', 'Save').click()
    cy.wait('@saveCustomer')

    // Should redirect to customer show page
    cy.url().should('include', '/customers/cust-noloyalty')
  })

  it('can toggle loyalty_enabled off', () => {
    cy.mockCustomer({ loyalty_enabled: true })

    cy.intercept('PUT', '**/api/v1/customers/*', (req) => {
      expect(req.body.loyalty_enabled).to.equal(false)
      req.reply({ statusCode: 200, body: req.body })
    }).as('saveCustomer')

    cy.visit('/customers/cust-123/edit')
    cy.wait('@getCustomer')

    cy.get('input[type="checkbox"]').uncheck()
    cy.contains('button', 'Save').click()

    cy.wait('@saveCustomer')
  })

  it('validates required fields', () => {
    cy.mockCustomer()

    cy.visit('/customers/cust-123/edit')
    cy.wait('@getCustomer')

    // Clear the name field
    cy.get('input').eq(0).clear()

    cy.on('window:alert', (text) => {
      // Alert shows array or string with validation message
      expect(text.toString()).to.include('name')
    })

    cy.contains('button', 'Save').click()
  })

  it('has Convert To User button', () => {
    cy.mockCustomer()

    cy.visit('/customers/cust-123/edit')
    cy.wait('@getCustomer')

    cy.contains('button', 'Convert To User').should('exist')
  })
})
