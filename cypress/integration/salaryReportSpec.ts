/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />

describe('salary report form', () => {
  const employee = 'Eka E_sukunimi'
  const client1 = 'Esimerkkiasiakas'

  beforeEach(() => {
    cy.visit('http://localhost:3000/reports/salary')
    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      'Generate report for salary purposes'
    )
  })

  it('should fill out the form and generate a report when selecting individual clients', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.contains(employee).click()
    cy.get('[data-cy=select-employee]').should('contain', employee)

    cy.get('[data-cy=select-multiple-clients]').click()
    cy.contains(client1).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-clients]').should('contain', client1)

    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      `Salary report for ${employee} created succesfully!`
    )
    cy.get('body')
      .should('contain', 'Preview of salary report')
      .and('contain', employee)
      .and('contain', client1)
  })

  it('should fill out the form and generate a report when using select all buttons', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.contains(employee).click()
    cy.get('[data-cy=select-employee]').should('contain', employee)

    cy.get('[data-cy=select-all-clients]').click()
    cy.get('[data-cy=select-multiple-clients]').should('contain', client1)

    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      `Salary report for ${employee} created succesfully!`
    )
    cy.get('body')
      .should('contain', 'Preview of salary report')
      .and('contain', employee)
      .and('contain', client1)
  })
})
