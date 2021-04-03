/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const employee = 'Eppu Etevä'

describe('Navigating the app as manager', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)
  })

  it('should show landing page', () => {
    cy.get('[data-cy=app-title]').should('contain', i18n.t('app.title'))
  })

  it('should open and close navigation drawer', () => {
    cy.get('[data-cy=close-menudrawer-button]').click()
    cy.get('[data-cy=dashboard-nav]').should('not.be.visible')
    cy.get('[data-cy=open-menudrawer-button]').click()
    cy.get('[data-cy=dashboard-nav]').should('be.visible')
  })

  it('should show input hours view', () => {
    cy.get('[data-cy=dashboard-nav]').click()
    cy.get('[data-cy=input-hours-title]').should('contain', i18n.t('timeInputs.title'))
  })

  it('should show projects view', () => {
    cy.get('[data-testid=projects-nav]').should('contain', i18n.t('project.title'))
    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=projects-title]').should('contain', i18n.t('project.title'))
  })

  it('should open different reports navigation', () => {
    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=billing-reports-nav]').should('contain', i18n.t('report.billing.label'))
    cy.get('[data-cy=salary-reports-nav]').should('contain', i18n.t('report.salary.label'))
  })

  it('should show billing reports view', () => {
    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=billing-reports-nav]').should('contain', i18n.t('report.billing.label'))
    cy.get('[data-cy=billing-reports-nav]').click()
    cy.get('[data-cy=reports-title]').should('contain', i18n.t('report.title'))
    cy.get('[data-cy=billing-reports-subtitle]').should(
      'contain',
      i18n.t('report.billing.form.title')
    )
  })

  it('should show salary reports view', () => {
    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=salary-reports-nav]').should('contain', i18n.t('report.salary.label'))
    cy.get('[data-cy=salary-reports-nav]').click()
    cy.get('[data-cy=reports-title]').should('contain', i18n.t('report.title'))
    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })
})

describe('Navigating the app as employee', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(employee).click()
    cy.get('[data-cy=select-user]').should('contain', employee)
  })

  it('should show landing page', () => {
    cy.get('[data-cy=app-title]').should('contain', i18n.t('app.title'))
  })

  it('should open and close navigation drawer', () => {
    cy.get('[data-cy=close-menudrawer-button]').click()
    cy.get('[data-cy=dashboard-nav]').should('not.be.visible')
    cy.get('[data-cy=open-menudrawer-button]').click()
    cy.get('[data-cy=dashboard-nav]').should('be.visible')
  })

  it('should show input hours view', () => {
    cy.get('[data-cy=dashboard-nav]').click()
    cy.get('[data-cy=input-hours-title]').should('contain', i18n.t('timeInputs.title'))
  })

  it('should show my projects view', () => {
    cy.get('[data-testid=projects-nav]').should('contain', i18n.t('project.myProjectsLabel'))
    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=projects-title]').should('contain', i18n.t('project.title'))
  })

  it('should show my salary reports view', () => {
    cy.get('[data-cy=salary-reports-nav]').should(
      'contain',
      i18n.t('report.salary.mySalaryReportLabel')
    )
    cy.get('[data-cy=salary-reports-nav]').click()
    cy.get('[data-cy=reports-title]').should('contain', i18n.t('report.title'))
    cy.get('[data-cy=salary-reports-subtitle]').should(
      'contain',
      i18n.t('report.salary.form.title')
    )
  })
})
