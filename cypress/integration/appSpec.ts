/// <reference types="cypress" />
import { getUnixTime, startOfWeek, lastDayOfWeek, format } from 'date-fns'
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const timestamp = getUnixTime(new Date())
const monday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy')
const sunday = format(lastDayOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy')

const manager = 'Billy Crystal'
const manager2 = 'Eva Green'
const client = 'Asiakas Kolmonen'
const employee1 = 'Oprah Winfrey'
const employee2 = 'Jimmy Kimmel'
const projectName = `cypress test project ${timestamp}`.replace(/\s/g, '-')
const description1 = 'koodailua'
const description2 = 'testailua'
const savedMessage = 'Last saved'

describe('when using the app', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()
  })

  it('manager should be able to create a project', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()

    cy.get('input[name="name"]').type(projectName)

    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()

    cy.get('[data-cy=select-owner]').click()
    cy.get('[role=listbox]>[role=option]').contains(manager).click()

    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee1).click()
    cy.contains(employee2).click()
    cy.get('body').click(0, 0)

    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.createSuccess', { project: projectName })
    )
    cy.get('[data-cy=projects-table]').should('contain', projectName)
  })

  it('employee should see added project in their projects view', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(employee1).click()
    cy.get('[data-cy=select-user]').should('contain', employee1)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=projects-table]').should('contain', projectName)
  })

  it('employee should be able to add timeinput', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(employee1).click()
    cy.get('[data-cy=select-user]').should('contain', employee1)

    cy.get(`[data-cy=${projectName}-input]`).eq(0).type('8')
    cy.get(`[data-cy=${projectName}-input]`).eq(1).type('7')
    cy.get(`[data-cy=${projectName}-input]`).eq(2).type('6')
    cy.get(`[data-cy=${projectName}-input]`).eq(3).type('5')
    cy.get(`[data-cy=${projectName}-input]`).eq(4).type('4')
    cy.get(`[data-cy=${projectName}-input]`).eq(5).type('3')
    cy.get(`[data-cy=${projectName}-input]`).eq(6).type('2')

    cy.contains(savedMessage)
  })

  it('owner should be able to add timeinput and description', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('#showDescription').check({ scrollBehavior: false })

    cy.get(`[data-cy=${projectName}-input]`).eq(0).type('8')
    cy.get(`[data-cy=${projectName}-description]`).eq(0).type(`${description1} 1`)
    cy.get('body').click(0, 0)

    cy.get(`[data-cy=${projectName}-input]`).eq(2).type('8')
    cy.get(`[data-cy=${projectName}-description]`).eq(2).type(`${description2} 1`)
    cy.get('body').click(0, 0)

    cy.get(`[data-cy=${projectName}-input]`).eq(4).type('8')
    cy.get(`[data-cy=${projectName}-description]`).eq(4).type(`${description2} 2`)
    cy.get('body').click(0, 0)

    cy.contains(savedMessage)
  })

  it('employee should be able to add timeinput and description', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(employee2).click()
    cy.get('[data-cy=select-user]').should('contain', employee2)

    cy.get('#showDescription').check({ scrollBehavior: false })

    cy.get(`[data-cy=${projectName}-input]`).eq(0).type('7')
    cy.get(`[data-cy=${projectName}-description]`).eq(0).type(`${description1} 1`)
    cy.get('body').click(0, 0)

    cy.get(`[data-cy=${projectName}-input]`).eq(1).type('7')
    cy.get(`[data-cy=${projectName}-description]`).eq(1).type(`${description2} 1`)
    cy.get('body').click(0, 0)

    cy.get(`[data-cy=${projectName}-input]`).eq(2).type('5')
    cy.get(`[data-cy=${projectName}-description]`).eq(2).type(`${description1} 2`)
    cy.get('body').click(0, 0)

    cy.get(`[data-cy=${projectName}-input]`).eq(3).type('5')
    cy.get(`[data-cy=${projectName}-description]`).eq(3).type(`${description2} 2`)
    cy.get('body').click(0, 0)

    cy.get(`[data-cy=${projectName}-input]`).eq(4).type('8')
    cy.get(`[data-cy=${projectName}-description]`).eq(4).type(`${description1} 3`)
    cy.get('body').click(0, 0)

    cy.contains(savedMessage)
  })

  it('employee should see project and logged timeinput in own salary report', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(employee2).click()
    cy.get('[data-cy=select-user]').should('contain', employee2)

    cy.get('[data-cy=salary-reports-nav]').click()

    cy.get('[data-cy=select-employee]').click()
    cy.get('[role=listbox]>[role=option]').contains(employee2).click()

    cy.get('[data-cy=select-all-clients]').click()

    cy.get('#start-date-picker').focus().clear().type(monday)
    cy.get('#end-date-picker').focus().clear().type(sunday)

    cy.get('[data-testid=salaryReportFormGenerate]').click()

    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee2 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', employee2)
      .and('contain', client)
      .and('contain', projectName)
      .and('contain', `${description1} 1`)
      .and('contain', `${description2} 1`)
      .and('contain', monday)
      .and('contain', sunday)
  })

  it('owner should see project and logged timeinput in own salary report', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=salary-reports-nav]').click()

    cy.get('[data-cy=select-employee]').click()
    cy.get('[role=listbox]>[role=option]').contains(manager).click()

    cy.get('[data-cy=select-all-clients]').click()

    cy.get('#start-date-picker').focus().clear().type(monday)
    cy.get('#end-date-picker').focus().clear().type(sunday)

    cy.get('[data-testid=salaryReportFormGenerate]').click()

    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: manager })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', manager)
      .and('contain', client)
      .and('contain', projectName)
      .and('contain', `${description1} 1`)
      .and('contain', `${description2} 1`)
      .and('contain', monday)
      .and('contain', sunday)
  })

  it("manager should see project and logged timeinput in employee's salary report", () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=salary-reports-nav]').click()

    cy.get('[data-cy=select-employee]').click()
    cy.contains(employee1).click()

    cy.get('[data-cy=select-all-clients]').click()

    cy.get('#start-date-picker').focus().clear().type(monday)
    cy.get('#end-date-picker').focus().clear().type(sunday)

    cy.get('[data-testid=salaryReportFormGenerate]').click()

    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.salary.message.success', { employee: employee1 })
    )
    cy.get('body')
      .should('contain', i18n.t('report.salary.preview.title'))
      .and('contain', employee1)
      .and('contain', client)
      .and('contain', projectName)
      .and('contain', monday)
      .and('contain', sunday)
  })

  it('manager should see project and logged timeinput in billing report', () => {
    cy.get('[data-cy=select-user]').click()
    cy.contains(manager2).click()
    cy.get('[data-cy=select-user]').should('contain', manager2)

    cy.get('[data-cy=reports-nav]').click()
    cy.get('[data-cy=billing-reports-nav]').click()

    cy.get('[data-cy=select-client]').click({ scrollBehavior: false })
    cy.contains(client).click()

    cy.get('[data-cy=select-multiple-projects]').click()
    cy.contains(projectName).click()
    cy.get('body').click(0, 0)

    cy.get('[data-cy=select-all-employees]').click()

    cy.get('#start-date-picker').focus().clear().type(monday)
    cy.get('#end-date-picker').focus().clear().type(sunday)

    cy.get('[data-testid=billingReportFormGenerate]').click()

    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('report.billing.message.success', { client })
    )
    cy.get('body')
      .should('contain', i18n.t('report.billing.preview.title'))
      .and('contain', projectName)
      .and('contain', employee1)
      .and('contain', employee2)
      .and('contain', manager)
      .and('contain', description1)
      .and('contain', description2)
      .and('contain', monday)
      .and('contain', sunday)
  })
})
