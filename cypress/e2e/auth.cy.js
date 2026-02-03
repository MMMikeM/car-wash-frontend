describe('Authentication', () => {
  beforeEach(() => {
    cy.logout()
  })

  describe('Login', () => {
    it('shows login form', () => {
      cy.visit('/login')
      cy.contains('Please log in')
      cy.get('input[type="text"]').should('exist')
      cy.get('input[type="password"]').should('exist')
      cy.contains('button', 'Login').should('exist')
    })

    it('shows error on failed login', () => {
      cy.intercept('POST', '**/api/v1/sign_in', {
        statusCode: 401,
        body: { error: 'Invalid credentials' },
      }).as('loginFailed')

      cy.visit('/login')
      cy.get('input[type="text"]').type('0821234567')
      cy.get('input[type="password"]').type('wrongpassword')

      cy.on('window:alert', (text) => {
        expect(text).to.equal('Login Failed')
      })

      cy.contains('button', 'Login').click()
    })

    it('redirects to home on successful login as manager', () => {
      // Mock the login API
      cy.intercept('POST', '**/api/v1/sign_in', {
        statusCode: 200,
        body: {
          is_success: true,
          data: {
            user: {
              id: 'user-123',
              email: 'manager@test.com',
              authentication_token: 'token-abc',
              roles: ['manager', 'salesperson'],
            },
          },
        },
      }).as('loginSuccess')

      // Mock the home page API calls that happen after redirect
      cy.intercept('GET', '**/api/v1/customers*', {
        statusCode: 200,
        headers: { 'X-Instance-Total': '0' },
        body: [],
      }).as('getCustomers')
      cy.intercept('GET', '**/api/v1/wash_types*', {
        statusCode: 200,
        body: [],
      }).as('getWashTypes')

      cy.visit('/login')
      cy.get('input[type="text"]').type('0821234567')
      cy.get('input[type="password"]').type('correctpassword')
      cy.contains('button', 'Login').click()

      cy.wait('@loginSuccess')
      // After login, session storage should have the token
      cy.window().its('sessionStorage').invoke('getItem', 'token').should('eq', 'token-abc')
    })

    it('has link to sign up page', () => {
      cy.visit('/login')
      cy.contains('Sign Up').should('have.attr', 'href', '/sign_up')
    })

    it('has link to forgot password', () => {
      cy.visit('/login')
      cy.contains('Forgot Password?').should('have.attr', 'href', '/forgot_password')
    })
  })

  describe('Protected Routes', () => {
    it('allows access to customers page when logged in as manager', () => {
      cy.login('manager')
      cy.mockCustomersList()
      cy.mockWashTypes()

      cy.visit('/customers')
      cy.wait('@getCustomers')
      cy.contains('John Doe').should('exist')
    })
  })
})
