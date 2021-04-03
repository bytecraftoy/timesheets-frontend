/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

const manager = 'Chrissy Teigen'
const manager2 = 'Eva Green'
const client = 'Esimerkkiasiakas'
const employee1 = 'Eppu Etevä'
const employee2 = 'Jimmy Kimmel'
const employee3 = 'Matt Damon'

const projectName = 'cypress test project'

describe('add project with employees', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should open add projects form', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-form-heading]').should('contain', i18n.t('project.createNew'))
  })

  it('should input project name', () => {
    cy.get('input[name="name"]').type(`${projectName} 1`)
    cy.get('input[name="name"]').should('have.value', `${projectName} 1`)
  })

  it('should input project description', () => {
    cy.get('textarea[name="description"]').type(`${projectName} with employees`)
    cy.get('textarea[name="description"]').should('have.value', `${projectName} with employees`)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select an owner', () => {
    cy.get('[data-cy=select-owner]').click()
    cy.get('[role=listbox]>[role=option]').contains(manager).click()
    cy.get('[data-cy=select-owner]').should('contain', manager)
  })

  it('should select employees', () => {
    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee1).click()
    cy.contains(employee2).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-employees]')
      .should('contain', employee1)
      .and('contain', employee2)
  })

  it('should be billable by default', () => {
    cy.get('[type=checkbox]').should('be.checked')
  })

  it('should add a new project succesfully', () => {
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.createSuccess', { project: `${projectName} 1` })
    )
    cy.get('[data-cy=projects-table]').should('contain', `${projectName} 1`)
  })
})

describe('add project without employees', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should open add projects form', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-form-heading]').should('contain', i18n.t('project.createNew'))
  })

  it('should input project name', () => {
    cy.get('input[name="name"]').type(`${projectName} 2`)
    cy.get('input[name="name"]').should('have.value', `${projectName} 2`)
  })

  it('should input project description', () => {
    cy.get('textarea[name="description"]').type(`${projectName} without employees`)
    cy.get('textarea[name="description"]').should('have.value', `${projectName} without employees`)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select an owner', () => {
    cy.get('[data-cy=select-owner]').click()
    cy.get('[role=listbox]>[role=option]').contains(manager).click()
    cy.get('[data-cy=select-owner]').should('contain', manager)
  })

  it('should add a new project succesfully', () => {
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.createSuccess', { project: `${projectName} 2` })
    )
    cy.get('[data-cy=projects-table]').should('contain', `${projectName} 2`)
  })
})

describe('add non-billable project', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should open add projects form', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-form-heading]').should('contain', i18n.t('project.createNew'))
  })

  it('should input project name', () => {
    cy.get('input[name="name"]').type(`${projectName} 3`)
    cy.get('input[name="name"]').should('have.value', `${projectName} 3`)
  })

  it('should input project description', () => {
    cy.get('textarea[name="description"]').type(`${projectName} non-billable`)
    cy.get('textarea[name="description"]').should('have.value', `${projectName} non-billable`)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select an owner', () => {
    cy.get('[data-cy=select-owner]').click()
    cy.get('[role=listbox]>[role=option]').contains(manager).click()
    cy.get('[data-cy=select-owner]').should('contain', manager)
  })

  it('should uncheck billable checkbox', () => {
    cy.get('[type=checkbox]').uncheck()
    cy.get('[type=checkbox]').should('not.be.checked')
  })

  it('should add a new non-billable project succesfully', () => {
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.createSuccess', { project: `${projectName} 3` })
    )
    cy.get('[data-cy=projects-table]').should('contain', `${projectName} 3`)
  })
})

describe('add project with owner other than current user', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should open add projects form', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-form-heading]').should('contain', i18n.t('project.createNew'))
  })

  it('should input project name', () => {
    cy.get('input[name="name"]').type(`${projectName} 4`)
    cy.get('input[name="name"]').should('have.value', `${projectName} 4`)
  })

  it('should input project description', () => {
    cy.get('textarea[name="description"]').type(`${projectName} with other owner`)
    cy.get('textarea[name="description"]').should('have.value', `${projectName} with other owner`)
  })

  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains(client).click()
    cy.get('[data-cy=select-client]').should('contain', client)
  })

  it('should select an owner', () => {
    cy.get('[data-cy=select-owner]').click()
    cy.get('[role=listbox]>[role=option]').contains(manager2).click()
    cy.get('[data-cy=select-owner]').should('contain', manager2)
  })

  it('should select employees', () => {
    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee1).click()
    cy.contains(employee2).click()
    cy.get('body').click(0, 0)
    cy.get('[data-cy=select-multiple-employees]')
      .should('contain', employee1)
      .and('contain', employee2)
  })

  it('should add a new project succesfully but now show it in projects table', () => {
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.createSuccess', { project: `${projectName} 4` })
    )
    cy.get('[data-cy=projects-table]').should('not.contain', `${projectName} 4`)
  })

  it('should show added project in all projects view', () => {
    cy.get('[type=checkbox]').should('not.be.checked')

    cy.get('[type=checkbox]').check()
    cy.get('[type=checkbox]').should('be.checked')
    cy.get('[data-cy=projects-table]').should('contain', `${projectName} 4`)
  })
})

describe('add employees for existing project', () => {
  beforeEach(() => {
    i18n.addResourceBundle('en', 'translations', translations)
  })

  it('should open projects view', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=close-notification-button]').click()

    cy.get('[data-cy=select-user]').click()
    cy.contains(manager).click()
    cy.get('[data-cy=select-user]').should('contain', manager)

    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=projects-title]').should('contain', i18n.t('project.title'))
  })

  it('should show project employees', () => {
    cy.get('[data-cy=expand-project-row]').first().click()
    cy.get('body').should('contain', employee1).and('contain', employee2)
  })

  it('shoud add an employee to the project', () => {
    cy.get('[data-cy=edit-employees-button]').click({ scrollBehavior: false })
    cy.get('[data-cy=select-multiple-employees]').click()
    cy.contains(employee3).click()
    cy.get('body').click(0, 0)
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('body').should('contain', employee1).and('contain', employee2).and('contain', employee3)
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.updateSuccess', { project: `${projectName} 1` })
    )
  })

  it('shoud add remove an employee from the project', () => {
    cy.get('[data-cy=edit-employees-button]').click({ scrollBehavior: false })
    cy.get('[data-cy=select-multiple-employees]').click()
    cy.get('[role=listbox]>[role=option]').contains(employee3).click()
    cy.get('body').click(0, 0)
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('body')
      .should('contain', employee1)
      .and('contain', employee2)
      .and('not.contain', employee3)
    cy.get('[data-cy=alert]').should(
      'contain',
      i18n.t('project.message.updateSuccess', { project: `${projectName} 1` })
    )
  })
})
