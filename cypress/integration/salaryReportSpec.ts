/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const employee1 = 'Taina Taitava'
const employee2 = 'Eppu Etevä'
const client2 = 'Asiakas Kakkonen'
const client3 = 'Asiakas Kolmonen'

describe('generating salary report', () => {
  before(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  describe('as manager', () => {
    describe('selecting manually one client', () => {
      before(() => {
        cy.openHomePage()
        cy.selectUser(manager)
        cy.navigateToManagerSalaryReportForm()
      })

      it('manager should see all employees', () => {
        cy.get('[data-cy=select-employee]').click()
        cy.get('body')
          .should('contain', employee1)
          .and('contain', employee2)
          .and('contain', manager)
        cy.get('body').click(0, 0)
      })

      it('should select an employee', () => {
        cy.selectEmployee(employee1)
      })

      it('should select a client', () => {
        cy.selectOneClientFromMultiple(client2)
      })

      it('should generate report succesfully', () => {
        cy.generateSalaryReport(employee1)
        cy.get('body')
          .should('contain', i18n.t('report.salary.preview.title'))
          .and('contain', employee1)
          .and('contain', client2)
      })
    })

    describe('selecting only billable projects', () => {
      before(() => {
        cy.openHomePage()
        cy.selectUser(manager)
        cy.navigateToManagerSalaryReportForm()
      })

      it('should select an employee', () => {
        cy.selectEmployee(employee1)
      })

      it('should select a client', () => {
        cy.selectOneClientFromMultiple(client2)
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
        cy.generateSalaryReport(employee1)
        cy.get('body')
          .should('contain', i18n.t('report.salary.preview.title'))
          .and('contain', i18n.t('billable.onlyBillable'))
          .and('contain', employee1)
          .and('contain', client2)
      })
    })

    describe('using select all buttons', () => {
      before(() => {
        cy.openHomePage()
        cy.selectUser(manager)
        cy.navigateToManagerSalaryReportForm()
      })

      it('should select an employee', () => {
        cy.selectEmployee(employee2)
      })

      it('should select all clients using select all button', () => {
        cy.selectAll('clients')
        cy.get('[data-cy=select-multiple-clients]').should('contain', client3)
      })

      it('should generate report succesfully', () => {
        cy.generateSalaryReport(employee2)
        cy.get('body')
          .should('contain', i18n.t('report.salary.preview.title'))
          .and('contain', employee2)
          .and('contain', client3)
      })
    })
  })

  describe('as employee', () => {
    before(() => {
      cy.openHomePage()
      cy.selectUser(employee1)
      cy.navigateToEmployeeSalaryReportForm()
    })

    it('employee only see themselves in employee list', () => {
      cy.get('[data-cy=select-employee]').click()
      cy.get('body')
        .should('contain', employee1)
        .and('not.contain', employee2)
        .and('not.contain', manager)
      cy.get('body').click(0, 0)
    })

    it('should select an employee', () => {
      cy.selectEmployee(employee1)
    })

    it('should select a client', () => {
      cy.selectOneClientFromMultiple(client2)
    })

    it('should generate report succesfully', () => {
      cy.generateSalaryReport(employee1)
      cy.get('body')
        .should('contain', i18n.t('report.salary.preview.title'))
        .and('contain', employee1)
        .and('contain', client2)
    })
  })
})
