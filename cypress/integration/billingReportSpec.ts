/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />

describe('billing report form', () => {
  const client = 'Esimerkkiasiakas'
  const project1 = 'Testi_projekti'
  const employee1 = 'Eka E_sukunimi'
  const employee2 = 'Toka T_sukunimi'

  beforeEach(() => {
    cy.visit('http://localhost:3000/reports/billing')
    cy.get('[data-cy=billing-reports-subtitle]').should(
      'contain',
      'Generate report for billing purposes'
    )
  })

  it('should fill out the form and generate a report when selecting individual projects and employees', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)

    cy.get('[data-cy=select-multiple-projects]').click()
    cy.contains(project1).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-projects]').should('contain', project1)

    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee1).click()
    cy.contains(employee2).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-employees]')
      .should('contain', employee1)
      .and('contain', employee2)

    cy.get('[data-testid=billingReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should('contain', `Billing report for ${client} created succesfully!`)
    cy.get('body')
      .should('contain', 'Preview of billing report')
      .and('contain', project1)
      .and('contain', employee1)
      .and('contain', employee2)
  })

  it('should fill out the form and generate a report when using select all buttons', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)

    cy.get('[data-cy=select-all-projects]').click()
    cy.get('[data-cy=select-multiple-projects]').should('contain', project1)

    cy.get('[data-cy=select-all-employees]').click()
    cy.get('[data-cy=select-multiple-employees]')
      .should('contain', employee1)
      .and('contain', employee2)

    cy.get('[data-testid=billingReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should('contain', `Billing report for ${client} created succesfully!`)
    cy.get('body')
      .should('contain', 'Preview of billing report')
      .and('contain', project1)
      .and('contain', employee1)
      .and('contain', employee2)
  })
})
