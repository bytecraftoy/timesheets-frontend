/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const employee1 = 'Taina Taitava'
const employee2 = 'Eppu Etevä'
const client1 = 'Esimerkkiasiakas'
const client2 = 'Asiakas Kakkonen'
const client3 = 'Asiakas Kolmonen'

describe('generate salary report as manager selecting manually one client', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/salary')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })

  it('manager should see all employees', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.get('body').should('contain', employee1).and('contain', employee2).and('contain', manager)
  })

  it('should select an employee', () => {
    cy.contains(employee1).click()
    cy.get('[data-cy=select-employee]').should('contain', employee1)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-multiple-clients]').click()
    cy.contains(client2).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-clients]').should('contain', client2)
  })

  it('should generate report succesfully', () => {
    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee1 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', employee1)
      .and('contain', client2)
  })
})

describe('generate salary report as manager only billable projects', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/salary')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })

  it('should select an employee', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.contains(employee1).click()
    cy.get('[data-cy=select-employee]').should('contain', employee1)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-multiple-clients]').click()
    cy.contains(client2).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-clients]').should('contain', client2)
  })

  it('billable and nonbillabe projects should be selected by default', () => {
    cy.get('#billable').should('be.checked')
    cy.get('#nonBillable').should('be.checked')
  })

  it('should unselect nonbillable checkbox', () => {
    cy.get('#nonBillable').uncheck()
    cy.get('#nonBillable').should('not.be.checked')
  })

  it('should generate report succesfully', () => {
    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee1 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', i18n.t('billable.onlyBillable'))
      .and('contain', employee1)
      .and('contain', client2)
  })
})

describe('generate salary report as manager selecting manually several clients', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/salary')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })

  it('should select an employee', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.contains(employee2).click()
    cy.get('[data-cy=select-employee]').should('contain', employee2)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-multiple-clients]').click()
    cy.contains(client1).click()
    cy.contains(client3).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-clients]').should('contain', client1).and('contain', client3)
  })

  it('should generate report succesfully', () => {
    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee2 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', employee2)
      .and('contain', client1)
      .and('contain', client3)
  })
})

describe('generate salary report as manager using select all buttons', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/salary')
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })

  it('should select an employee', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.contains(employee2).click()
    cy.get('[data-cy=select-employee]').should('contain', employee2)
  })

  it('should select all clients using select all button', () => {
    cy.get('[data-cy=select-all-clients]').click()
    cy.get('[data-cy=select-multiple-clients]').should('contain', client1).and('contain', client3)
  })

  it('should generate report succesfully', () => {
    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee2 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', employee2)
      .and('contain', client1)
      .and('contain', client3)
  })
})

describe('generate salary report as employee', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should show salary report form', () => {
    cy.visit('http://localhost:3000/reports/salary')
    cy.get('[data-cy=select-user]').click()
    cy.contains(employee1).click()
    cy.get('[data-cy=select-user]').should('contain', employee1)

    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })

  it('employee only see themselves in employee list', () => {
    cy.get('[data-cy=select-employee]').click()
    cy.get('body')
      .should('contain', employee1)
      .and('not.contain', employee2)
      .and('not.contain', manager)
  })

  it('should select an employee', () => {
    cy.get('[role=listbox]>[role=option]').contains(employee1).click()
    cy.get('[data-cy=select-employee]').should('contain', employee1)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-multiple-clients]').click()
    cy.contains(client2).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-clients]').should('contain', client2)
  })

  it('should generate report succesfully', () => {
    cy.get('[data-testid=salaryReportFormGenerate]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee1 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', employee1)
      .and('contain', client2)
  })
})
