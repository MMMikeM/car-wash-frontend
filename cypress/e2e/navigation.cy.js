describe('Navigation', () => {
  describe('Manager Navigation', () => {
    beforeEach(() => {
      cy.login('manager')
      cy.mockWashTypes()
      cy.mockCustomersList()
    })

    it('can navigate to customers list', () => {
      cy.visit('/customers')
      cy.wait('@getCustomers')
      cy.contains('John Doe').should('exist')
    })

    it('can navigate from customers list to customer detail', () => {
      cy.mockCustomer({ id: 'cust-1', name: 'John Doe' })

      cy.visit('/customers')
      cy.wait('@getCustomers')

      // Click the info icon link in the row with John Doe
      cy.contains('tr', 'John Doe').find('a[href="/customers/cust-1"]').click()
      cy.wait('@getCustomer')
      cy.url().should('include', '/customers/cust-1')
    })

    it('can access customer edit page directly', () => {
      cy.mockCustomer({ id: 'cust-1', name: 'John Doe' })

      cy.visit('/customers/cust-1/edit')
      cy.wait('@getCustomer')

      // Verify edit page loaded with customer data
      cy.get('input').eq(0).should('have.value', 'John Doe')
    })
  })

  describe('Salesperson Navigation', () => {
    beforeEach(() => {
      cy.login('salesperson')
      cy.mockWashTypes()
    })

    it('can access customer search', () => {
      cy.intercept('GET', '**/api/v1/customers?*', {
        statusCode: 200,
        headers: { 'X-Instance-Total': '0' },
        body: [],
      }).as('searchCustomers')

      cy.visit('/customers/search')
      // Page should load without error
      cy.url().should('include', '/customers/search')
    })
  })

  describe('Route Protection', () => {
    it('login page is accessible without auth', () => {
      cy.logout()
      cy.visit('/login')
      cy.contains('Please log in').should('exist')
    })

    it('sign up page is accessible without auth', () => {
      cy.logout()
      cy.visit('/sign_up')
      cy.url().should('include', '/sign_up')
    })
  })
})
