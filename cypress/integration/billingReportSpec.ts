/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const client = 'Asiakas Kakkonen'
const project1 = 'Toinen projekti'
const employee1 = 'Taina Taitava'
const employee2 = 'Teemu Terävä'

describe('generate billing report as manager selecting specs manually', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/billing')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=billing-reports-subtitle]').should(
      'contain',
      i18n.t('report.billing.form.title')
    )
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click({ scrollBehavior: false })
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select a project', () => {
    cy.get('[data-cy=select-multiple-projects]').click()
    cy.contains(project1).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-projects]').should('contain', project1)
  })

  it('should select an employee', () => {
    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee1).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-employees]').should('contain', employee1)
  })

  it('generate report succesfully', () => {
    cy.get('[data-testid=billingReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.billing.message.success', { client })
    )
    cy.get('body')
      .should('contain', i18n.t('report.billing.preview.title'))
      .and('contain', project1)
      .and('contain', employee1)
  })
})

describe('generate billing report as manager using select all buttons', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/billing')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=billing-reports-subtitle]').should(
      'contain',
      i18n.t('report.billing.form.title')
    )
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click({ scrollBehavior: false })
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select all projects', () => {
    cy.get('[data-cy=select-all-projects]').click()
    cy.get('[data-cy=select-multiple-projects]').should('contain', project1)
  })

  it('should select all employees', () => {
    cy.get('[data-cy=select-all-employees]').click()
    cy.get('[data-cy=select-multiple-employees]')
      .should('contain', employee1)
      .and('contain', employee2)
  })

  it('generate report succesfully', () => {
    cy.get('[data-testid=billingReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.billing.message.success', { client })
    )
    cy.get('body')
      .should('contain', i18n.t('report.billing.preview.title'))
      .and('contain', project1)
      .and('contain', employee1)
      .and('contain', employee2)
  })
})

describe('generate billing report as manager selecting only non-billable projects', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/billing')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=billing-reports-subtitle]').should(
      'contain',
      i18n.t('report.billing.form.title')
    )
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click({ scrollBehavior: false })
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select a project', () => {
    cy.get('[data-cy=select-multiple-projects]').click()
    cy.contains(project1).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-projects]').should('contain', project1)
  })

  it('billable and nonbillabe projects should be selected by default', () => {
    cy.get('#billable').should('be.checked')
    cy.get('#nonBillable').should('be.checked')
  })

  it('should unselect nonbillable checkbox', () => {
    cy.get('#billable').uncheck()
    cy.get('#billable').should('not.be.checked')
  })

  it('should select an employee', () => {
    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee1).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-employees]').should('contain', employee1)
  })

  it('generate report succesfully', () => {
    cy.get('[data-testid=billingReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.billing.message.success', { client })
    )
    cy.get('body')
      .should('contain', i18n.t('report.billing.preview.title'))
      .and('contain', i18n.t('billable.onlyNonBillable'))
  })
})
