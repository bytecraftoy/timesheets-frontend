/// <reference types="cypress" />
import { getUnixTime, startOfWeek, lastDayOfWeek, format } from 'date-fns'
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const timestamp = getUnixTime(new Date())
const mondayDate = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy')
const sundayDate = format(lastDayOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy')

const monday = 0
const tuesday = 1
const wednesday = 2
const thursday = 3
const friday = 4
const saturday = 5
const sunday = 6

const manager = 'Billy Crystal'
const manager2 = 'Eva Green'
const client = 'Asiakas Kolmonen'
const employee1 = 'Oprah Winfrey'
const employee2 = 'Jimmy Kimmel'

const project = `cypress-test-project-${timestamp}`
const description1 = 'koodailua'
const description2 = 'testailua'
const savedMessage = 'Last saved'

describe('app', () => {
  before(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  beforeEach(() => {
    cy.openHomePage()
  })

  describe('creating and viewing project', () => {
    describe('as manager', () => {
      it('should be possible to create a project', () => {
        cy.selectUser(manager)
        cy.navigateToAddProjectsForm()

        cy.inputProjectName(project)
        cy.selectClient(client)
        cy.selectOwner(manager)
        cy.selectOneEmployeeFromMultiple(employee1)
        cy.selectOneEmployeeFromMultiple(employee2)

        cy.submitProjectForm(project)
        cy.get('[data-cy=projects-table]').should('contain', project)
      })
    })

    describe('as employee', () => {
      it('should be possible to see project in projects view', () => {
        cy.selectUser(employee1)
        cy.navigateToEmployeeProjectsView()
        cy.get('[data-cy=projects-table]').should('contain', project)
      })
    })
  })

  describe('inputting hours', () => {
    describe('as manager', () => {
      it('should be possible to input hours with descriptions', () => {
        cy.selectUser(manager)
        cy.checkShowDescription()

        cy.inputHours(project, monday, '8')
        cy.inputDescriptionToHours(project, monday, `${description1} 1`)

        cy.inputHours(project, wednesday, '8')
        cy.inputDescriptionToHours(project, wednesday, `${description2} 1`)

        cy.inputHours(project, friday, '8')
        cy.inputDescriptionToHours(project, friday, `${description1} 2`)

        cy.contains(savedMessage)
      })
    })

    describe('as employee', () => {
      it('should be possible to input hours', () => {
        cy.selectUser(employee1)

        cy.inputHours(project, monday, '8')
        cy.inputHours(project, tuesday, '7')
        cy.inputHours(project, wednesday, '6')
        cy.inputHours(project, thursday, '5')
        cy.inputHours(project, friday, '4')
        cy.inputHours(project, saturday, '3')
        cy.inputHours(project, sunday, '2')

        cy.contains(savedMessage)
      })

      it('should be possible to input hours with descriptions', () => {
        cy.selectUser(employee2)

        cy.checkShowDescription()

        cy.inputHours(project, monday, '7')
        cy.inputDescriptionToHours(project, monday, `${description1} 1`)

        cy.inputHours(project, tuesday, '7')
        cy.inputDescriptionToHours(project, tuesday, `${description2} 1`)

        cy.inputHours(project, wednesday, '5')
        cy.inputDescriptionToHours(project, wednesday, `${description1} 2`)

        cy.inputHours(project, thursday, '5')
        cy.inputDescriptionToHours(project, thursday, `${description2} 2`)

        cy.inputHours(project, friday, '8')
        cy.inputDescriptionToHours(project, friday, `${description1} 3`)

        cy.contains(savedMessage)
      })
    })
  })

  describe('generating salay report', () => {
    describe('as manager', () => {
      // this does not currently pass
      it('should be possible to see project and logged timeinput in own salary report (does not pass)', () => {
        cy.selectUser(manager)
        cy.navigateToManagerSalaryReportForm()
        cy.selectEmployee(manager)
        cy.selectAll('clients')
        cy.inputTimeInterval(mondayDate, sundayDate)
        cy.generateSalaryReport(manager)

        cy.get('body')
          .should('contain', i18n.t('report.salary.preview.title'))
          .and('contain', manager)
          .and('contain', client)
          .and('contain', project)
          .and('contain', `${description1} 1`)
          .and('contain', `${description2} 1`)
          .and('contain', mondayDate)
          .and('contain', sundayDate)
      })

      it("should be possible to see project and logged timeinput in employee's salary report", () => {
        cy.selectUser(manager)
        cy.navigateToManagerSalaryReportForm()
        cy.selectEmployee(employee1)
        cy.selectAll('clients')
        cy.inputTimeInterval(mondayDate, sundayDate)
        cy.generateSalaryReport(employee1)

        cy.get('body')
          .should('contain', i18n.t('report.salary.preview.title'))
          .and('contain', employee1)
          .and('contain', client)
          .and('contain', project)
          .and('contain', mondayDate)
          .and('contain', sundayDate)
      })
    })

    describe('as employee', () => {
      it('should be possibel to see project and logged timeinput in own salary report', () => {
        cy.selectUser(employee2)
        cy.navigateToEmployeeSalaryReportForm()
        cy.selectEmployee(employee2)
        cy.selectAll('clients')
        cy.inputTimeInterval(mondayDate, sundayDate)
        cy.generateSalaryReport(employee2)

        cy.get('body')
          .should('contain', i18n.t('report.salary.preview.title'))
          .and('contain', employee2)
          .and('contain', client)
          .and('contain', project)
          .and('contain', `${description1} 1`)
          .and('contain', `${description2} 1`)
          .and('contain', mondayDate)
          .and('contain', sundayDate)
      })
    })
  })

  describe('generating billing report', () => {
    describe('as manager', () => {
      // this does not currently pass
      it('manager should see project and logged timeinput in billing report (does not pass)', () => {
        cy.selectUser(manager2)
        cy.navigateToBillingReportForm()
        cy.selectClient(client)
        cy.selectOneProjectFromMultiple(project)
        cy.selectAll('employees')
        cy.inputTimeInterval(mondayDate, sundayDate)
        cy.generateBillingReport(client)

        cy.get('body')
          .should('contain', i18n.t('report.billing.preview.title'))
          .and('contain', project)
          .and('contain', employee1)
          .and('contain', employee2)
          .and('contain', manager)
          .and('contain', description1)
          .and('contain', description2)
          .and('contain', mondayDate)
          .and('contain', sundayDate)
      })
    })
  })
})
