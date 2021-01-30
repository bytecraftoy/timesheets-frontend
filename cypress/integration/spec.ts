/// <reference types="cypress" />

describe('Basic navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should show landing page', () => {
    cy.get('[data-cy=app-title]').should('contain', 'Timesheets')
  })

  it('should open and close navigation drawer', () => {
    cy.get('[data-cy=close-menudrawer-button]').click()
    cy.get('[data-cy=dashboard-nav]').should('not.be.visible')
    cy.get('[data-cy=open-menudrawer-button]').click()
    cy.get('[data-cy=dashboard-nav]').should('be.visible')
  })

  it('should show input hours view', () => {
    cy.get('[data-cy=dashboard-nav]').click()
    cy.get('[data-cy=input-hours-title]').should('contain', 'Input hours')
  })

  it('should show projects view', () => {
    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=projects-title]').should('contain', 'Projects')
  })

  it('should open add projects form', () => {
    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-form-heading]').should('contain', 'Create new project')
  })

  it('should open different reports navigation', () => {
    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=billing-reports-nav]').should('contain', 'Billing')
  })

  it('should show billing reports view', () => {
    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=billing-reports-nav]').click()
    cy.get('[data-cy=reports-title]').should('contain', 'Reports')
    cy.get('[data-cy=billing-reports-subtitle]').should(
      'contain',
      'Generate report for billing purposes.'
    )
  })
})
