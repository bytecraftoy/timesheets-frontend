/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />
import { getUnixTime } from 'date-fns'
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const manager2 = 'Eva Green'
const client = 'Esimerkkiasiakas'
const employee1 = 'Eppu Etevä'
const employee2 = 'Jimmy Kimmel'
const employee3 = 'Matt Damon'

const timestamp = getUnixTime(new Date())
const projectName = `cypress-test-project-${timestamp}`

describe('creating and editing projects', () => {
  before(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  describe('new project with employees', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToAddProjectsForm()
    })

    it('should input project name', () => {
      cy.inputProjectName(`${projectName}1`)
    })

    it('should input project description', () => {
      cy.inputProjectDescription(`${projectName}1 with employees`)
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select an owner', () => {
      cy.selectOwner(manager)
    })

    it('should select employees', () => {
      cy.selectOneEmployeeFromMultiple(employee1)
      cy.selectOneEmployeeFromMultiple(employee2)
    })

    it('should be billable by default', () => {
      cy.get('[type=checkbox]').should('be.checked')
    })

    it('should add a new project succesfully', () => {
      cy.submitProjectForm(`${projectName}1`)
      cy.get('[data-cy=projects-table]').should('contain', `${projectName}1`)
    })
  })

  describe('new project without employees', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToAddProjectsForm()
    })

    it('should input project name', () => {
      cy.inputProjectName(`${projectName}2`)
    })

    it('should input project description', () => {
      cy.inputProjectDescription(`${projectName}2 without employees`)
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select an owner', () => {
      cy.selectOwner(manager)
    })

    it('should add a new project succesfully', () => {
      cy.submitProjectForm(`${projectName}2`)
      cy.get('[data-cy=projects-table]').should('contain', `${projectName}2`)
    })
  })

  describe('new non-billable project', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToAddProjectsForm()
    })

    it('should input project name', () => {
      cy.inputProjectName(`${projectName}3`)
    })

    it('should input project description', () => {
      cy.inputProjectDescription(`${projectName}3 non-billable`)
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select an owner', () => {
      cy.selectOwner(manager)
    })

    it('should uncheck billable checkbox', () => {
      cy.get('[type=checkbox]').uncheck()
      cy.get('[type=checkbox]').should('not.be.checked')
    })

    it('should add a new non-billable project succesfully', () => {
      cy.submitProjectForm(`${projectName}3`)
      cy.get('[data-cy=projects-table]').should('contain', `${projectName}3`)
    })
  })

  describe('new project with owner other than current user', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToAddProjectsForm()
    })

    it('should input project name', () => {
      cy.inputProjectName(`${projectName}4`)
    })

    it('should input project description', () => {
      cy.inputProjectDescription(`${projectName}4 with other owner`)
    })

    it('should select a client', () => {
      cy.selectClient(client)
    })

    it('should select an owner', () => {
      cy.selectOwner(manager2)
    })

    it('should select employees', () => {
      cy.selectOneEmployeeFromMultiple(employee1)
      cy.selectOneEmployeeFromMultiple(employee2)
    })

    it('should add a new project succesfully but now show it in projects table', () => {
      cy.submitProjectForm(`${projectName}4`)
      cy.get('[data-cy=projects-table]').should('not.contain', `${projectName}4`)
    })

    it('should show added project in all projects view', () => {
      cy.checkShowAllProjects()
      cy.get('[data-cy=projects-table]').should('contain', `${projectName}4`)
    })
  })

  describe('add employees for existing project', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager)
      cy.navigateToAddProjectsForm()
      cy.inputProjectName(`${projectName}5`)
      cy.selectClient(client)
      cy.selectOwner(manager)
      cy.selectOneEmployeeFromMultiple(employee1)
      cy.selectOneEmployeeFromMultiple(employee2)
      cy.submitProjectForm(`${projectName}5`)
      cy.get('[data-cy=projects-table]').should('contain', `${projectName}5`)
    })

    it('should show project employees', () => {
      cy.get('[data-cy=expand-project-row]').last().click()
      cy.get('body').should('contain', employee1).and('contain', employee2)
    })

    it('shoud add an employee to the project', () => {
      cy.get('[data-cy=edit-employees-button]').click()
      cy.selectOneEmployeeFromMultiple(employee3)
      cy.submitEditProjectEmployeesForm(`${projectName}5`)
      cy.get('body')
        .should('contain', employee1)
        .and('contain', employee2)
        .and('contain', employee3)
    })

    it('shoud remove an employee from the project', () => {
      cy.get('[data-cy=edit-employees-button]').click()
      cy.unselectOneEmployee(employee3)
      cy.submitEditProjectEmployeesForm(`${projectName}5`)
      cy.get('body')
        .should('contain', employee1)
        .and('contain', employee2)
        .and('not.contain', employee3)
    })
  })

  // this should not pass currently
  describe('removing current manager-user from employees', () => {
    before(() => {
      cy.openHomePage()
      cy.closeNotification()
      cy.selectUser(manager2)
      cy.navigateToAddProjectsForm()
      cy.inputProjectName(`${projectName}6`)
      cy.selectClient(client)
      cy.selectOwner(manager)
      cy.selectOneEmployeeFromMultiple(manager2)
      cy.submitProjectForm(`${projectName}6`)
      cy.get('[data-cy=projects-table]').should('contain', `${projectName}6`)
    })

    it("should remove project from manager-user's own projects", () => {
      cy.get('[data-cy=expand-project-row]').last().click()
      cy.get('body').should('contain', manager2)
      cy.get('[data-cy=edit-employees-button]').click()
      cy.unselectOneEmployee(manager2)
      cy.submitEditProjectEmployeesForm(`${projectName}6`)
      cy.get('body').should('not.contain', `${projectName}6`)
    })
  })
})
