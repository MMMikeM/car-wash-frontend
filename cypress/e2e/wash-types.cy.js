describe('Wash Types (Settings)', () => {
  beforeEach(() => {
    cy.login('manager')
    cy.mockWashTypes()
  })

  describe('Edit Wash Type', () => {
    it('loads wash type data', () => {
      cy.intercept('GET', '**/api/v1/wash_types/wt-2', {
        statusCode: 200,
        body: {
          id: 'wt-2',
          name: 'Wash & Go',
          points: 10,
          price: 5000,
          cost: 2000,
          description: 'Quick wash',
          order: 1,
        },
      }).as('getWashType')

      cy.visit('/wash_types/wt-2/edit')
      cy.wait('@getWashType')

      cy.get('input').eq(0).should('have.value', 'Wash & Go')
    })

    it('saves wash type WITHOUT sending extra fields (optimized payload)', () => {
      cy.intercept('GET', '**/api/v1/wash_types/wt-2', {
        statusCode: 200,
        body: {
          id: 'wt-2',
          name: 'Wash & Go',
          points: 10,
          price: 5000,
          cost: 2000,
          description: 'Quick wash',
          order: 1,
          hidden: false,
          free: false,
          // Extra fields that shouldn't be sent back
          created_at: '2020-01-01',
          updated_at: '2024-01-01',
        },
      }).as('getWashType')

      cy.intercept('PUT', '**/api/v1/wash_types/wt-2', (req) => {
        // Verify only editable fields are sent
        expect(req.body).to.have.property('name')
        expect(req.body).to.have.property('cost')
        expect(req.body).to.have.property('price')
        expect(req.body).to.have.property('points')
        expect(req.body).to.have.property('description')
        expect(req.body).to.have.property('order')

        // Should NOT have these
        expect(req.body).to.not.have.property('created_at')
        expect(req.body).to.not.have.property('updated_at')
        expect(req.body).to.not.have.property('hidden')

        req.reply({ statusCode: 200, body: req.body })
      }).as('saveWashType')

      cy.visit('/wash_types/wt-2/edit')
      cy.wait('@getWashType')

      // Update name
      cy.get('input').eq(0).clear().type('Wash & Go Premium')

      cy.contains('button', 'Save').click()
      cy.wait('@saveWashType')
    })
  })

  describe('Settings Edit (Free Wash)', () => {
    it('saves settings WITHOUT sending extra fields', () => {
      cy.intercept('GET', '**/api/v1/wash_types/wt-1', {
        statusCode: 200,
        body: {
          id: 'wt-1',
          name: 'Free Wash',
          points: 0,
          cost: 0,
          description: 'Loyalty reward',
        },
      }).as('getWashType')

      cy.intercept('PUT', '**/api/v1/wash_types/wt-1', (req) => {
        // Verify only expected fields
        expect(req.body).to.have.property('name')
        expect(req.body).to.have.property('cost')
        expect(req.body).to.have.property('points')
        expect(req.body).to.have.property('description')

        req.reply({ statusCode: 200, body: req.body })
      }).as('saveWashType')

      cy.visit('/settings/wt-1/edit')
      cy.wait('@getWashType')

      cy.contains('button', 'Save').click()
      cy.wait('@saveWashType')
    })
  })
})
