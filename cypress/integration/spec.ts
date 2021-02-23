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
      'Generate report for billing purposes'
    )
  })

  it('should show salary reports view', () => {
    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=salary-reports-nav]').click()
    cy.get('[data-cy=reports-title]').should('contain', 'Reports')
    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      'Generate report for salary purposes'
    )
  })
})
