/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const employee = 'Eppu Etevä'

const openAndCloseNavigationSideBar = () => {
  cy.get('[data-cy=close-menudrawer-button]').click()
  cy.get('[data-cy=dashboard-nav]').should('not.be.visible')
  cy.get('[data-cy=open-menudrawer-button]').click()
  cy.get('[data-cy=dashboard-nav]').should('be.visible')
}

describe('Navigating the app', () => {
  before(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  describe('as manager', () => {
    beforeEach(() => {
      cy.openHomePage()
      cy.selectUser(manager)
    })

    it('should show home page', () => {
      cy.get('[data-cy=app-title]').should('contain', i18n.t('app.title'))
    })

    it('should open and close navigation drawer', () => {
      openAndCloseNavigationSideBar()
    })

    it('should show input hours view', () => {
      cy.navigateToDashboard()
    })

    it('should show projects view', () => {
      cy.navigateToManagerProjectsView()
    })

    it('should open different reports navigation', () => {
      cy.get('[data-cy=reports-nav]').click()
      cy.get('[data-cy=billing-reports-nav]').should('contain', i18n.t('report.billing.label'))
      cy.get('[data-cy=salary-reports-nav]').should('contain', i18n.t('report.salary.label'))
    })

    it('should show billing reports view', () => {
      cy.navigateToBillingReportForm()
    })

    it('should show salary reports view', () => {
      cy.navigateToManagerSalaryReportForm()
    })
  })

  describe('as employee', () => {
    beforeEach(() => {
      cy.openHomePage()
      cy.selectUser(employee)
    })

    it('should show home page', () => {
      cy.get('[data-cy=app-title]').should('contain', i18n.t('app.title'))
    })

    it('should open and close navigation drawer', () => {
      openAndCloseNavigationSideBar()
    })

    it('should show input hours view', () => {
      cy.navigateToDashboard()
    })

    it('should show my projects view', () => {
      cy.navigateToEmployeeProjectsView()
    })

    it('should show my salary reports view', () => {
      cy.navigateToEmployeeSalaryReportForm()
    })
  })

  describe('without authorisation', () => {
    describe('add project form', () => {
      it('should redirect employee user to projects view', () => {
        cy.visit('http://localhost:3000/projects/new-project')
        cy.selectUser(employee)
        cy.url().should('eq', 'http://localhost:3000/projects')
      })
    })

    describe('billing report form', () => {
      it('should redirect employee user to home page', () => {
        cy.visit('http://localhost:3000/reports/billing')
        cy.selectUser(employee)
        cy.url().should('eq', 'http://localhost:3000/')
      })
    })

    describe('billing report preview without report data', () => {
      it('should redirect to billing report form', () => {
        cy.visit('http://localhost:3000/reports/billing/preview')
        cy.url().should('eq', 'http://localhost:3000/reports/billing')
      })
    })

    describe('salary report preview without report data', () => {
      it('should redirect to salary report form', () => {
        cy.visit('http://localhost:3000/reports/salary/preview')
        cy.url().should('eq', 'http://localhost:3000/reports/salary')
      })
    })
  })
})
