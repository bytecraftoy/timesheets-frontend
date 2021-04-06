/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const client = 'Asiakas Kakkonen'
const project1 = 'Toinen projekti'
const employee1 = 'Taina Taitava'
const employee2 = 'Teemu Terävä'

describe('generating billing report', () => {
  before(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  describe('selecting specs manually', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToBillingReportForm()
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select a project', () => {
      cy.selectOneProjectFromMultiple(project1)
    })

    it('should select an employee', () => {
      cy.selectOneEmployeeFromMultiple(employee1)
    })

    it('generate report succesfully', () => {
      cy.generateBillingReport(client)
      cy.get('body')
        .should('contain', i18n.t('report.billing.preview.title'))
        .and('contain', project1)
        .and('contain', employee1)
    })
  })

  describe('using select all buttons', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToBillingReportForm()
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select all projects', () => {
      cy.selectAll('projects')
      cy.get('[data-cy=select-multiple-projects]').should('contain', project1)
    })

    it('should select all employees', () => {
      cy.selectAll('employees')
      cy.get('[data-cy=select-multiple-employees]')
        .should('contain', employee1)
        .and('contain', employee2)
    })

    it('generate report succesfully', () => {
      cy.generateBillingReport(client)
      cy.get('body')
        .should('contain', i18n.t('report.billing.preview.title'))
        .and('contain', project1)
        .and('contain', employee1)
        .and('contain', employee2)
    })
  })

  describe('selecting only non-billable projects', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToBillingReportForm()
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select a project', () => {
      cy.selectOneProjectFromMultiple(project1)
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
      cy.selectOneEmployeeFromMultiple(employee1)
    })

    it('generate report succesfully', () => {
      cy.generateBillingReport(client)
      cy.get('body')
        .should('contain', i18n.t('report.billing.preview.title'))
        .and('contain', i18n.t('billable.onlyNonBillable'))
    })
  })
})
