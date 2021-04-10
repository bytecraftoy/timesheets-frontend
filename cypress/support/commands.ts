/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
import i18n from '../../src/i18n'
import * as translations from '../../src/locales/en_translation.json'

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      openHomePage: typeof openHomePage
      // check
      checkShowAllProjects: typeof checkShowAllProjects
      checkShowDescription: typeof checkShowDescription
      // input
      inputProjectName(name: string): typeof inputProjectName
      inputProjectDescription(description: string): typeof inputProjectDescription
      inputDescriptionToHours(
        projectName: string,
        weekday: number,
        description: string
      ): typeof inputDescriptionToHours
      inputHours(projectName: string, weekday: number, input: string): typeof inputHours
      inputTimeInterval(start: string, end: string): typeof inputTimeInterval
      // navigate
      navigateToDashboard: typeof navigateToDashboard
      navigateToManagerProjectsView: typeof navigateToManagerProjectsView
      navigateToAddProjectsForm: typeof navigateToAddProjectsForm
      navigateToEmployeeProjectsView: typeof navigateToEmployeeProjectsView
      navigateToBillingReportForm: typeof navigateToBillingReportForm
      navigateToManagerSalaryReportForm: typeof navigateToManagerSalaryReportForm
      navigateToEmployeeSalaryReportForm: typeof navigateToEmployeeSalaryReportForm
      // select
      selectUser(user: string): typeof selectUser
      selectClient(client: string): typeof selectClient
      selectOneClientFromMultiple(client: string): typeof selectOneClientFromMultiple
      selectOwner(owner: string): typeof selectOwner
      selectAll(type: string): typeof selectAll
      selectEmployee(employee: string): typeof selectEmployee
      selectOneEmployeeFromMultiple(employee: string): typeof selectOneEmployeeFromMultiple
      unselectOneEmployee(employee: string): typeof unselectOneEmployee
      selectOneProjectFromMultiple(project: string): typeof selectOneProjectFromMultiple
      // submit / generage
      submitProjectForm(projectName: string): typeof submitProjectForm
      submitEditProjectEmployeesForm(projectName: string): typeof submitEditProjectEmployeesForm
      generateBillingReport(client: string): typeof generateBillingReport
      generateSalaryReport(employee: string): typeof generateSalaryReport
    }
  }
}

i18n.addResourceBundle('en', 'translations', translations)

// misc

function openHomePage() {
  cy.visit('http://localhost:3000/')
}
Cypress.Commands.add('openHomePage', openHomePage)

// check

function checkShowAllProjects() {
  cy.get('[type=checkbox]').should('not.be.checked')
  cy.get('[type=checkbox]').check({ scrollBehavior: false })
  cy.get('[type=checkbox]').should('be.checked')
}
Cypress.Commands.add('checkShowAllProjects', checkShowAllProjects)

function checkShowDescription() {
  cy.get('#showDescription').check({ scrollBehavior: false })
}
Cypress.Commands.add('checkShowDescription', checkShowDescription)

// input

function inputProjectName(name: string) {
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="name"]').should('have.value', name)
}
Cypress.Commands.add('inputProjectName', inputProjectName)

function inputProjectDescription(description: string) {
  cy.get('textarea[name="description"]').type(description)
  cy.get('textarea[name="description"]').should('have.value', description)
}
Cypress.Commands.add('inputProjectDescription', inputProjectDescription)

function inputHours(projectName: string, weekday: number, input: string) {
  cy.get(`[data-cy=${projectName}-input]`).eq(weekday).type(input)
}
Cypress.Commands.add('inputHours', inputHours)

function inputDescriptionToHours(projectName: string, weekday: number, description: string) {
  cy.get(`[data-cy=${projectName}-description]`).eq(weekday).type(description)
  cy.get('body').click(0, 0)
}
Cypress.Commands.add('inputDescriptionToHours', inputDescriptionToHours)

function inputTimeInterval(start: string, end: string) {
  cy.get('#start-date-picker').focus().clear().type(start)
  cy.get('#end-date-picker').focus().clear().type(end)
}
Cypress.Commands.add('inputTimeInterval', inputTimeInterval)

// navigate

function navigateToDashboard() {
  cy.get('[data-cy=dashboard-nav]').click()
  cy.get('[data-cy=input-hours-title]').should('contain', i18n.t('timeInputs.title'))
}
Cypress.Commands.add('navigateToDashboard', navigateToDashboard)

function navigateToManagerProjectsView() {
  cy.get('[data-testid=projects-nav]').should('contain', i18n.t('project.title'))
  cy.get('[data-testid=projects-nav]').click()
  cy.get('[data-cy=projects-title]').should('contain', i18n.t('project.title'))
}
Cypress.Commands.add('navigateToManagerProjectsView', navigateToManagerProjectsView)

function navigateToAddProjectsForm() {
  navigateToManagerProjectsView()
  cy.get('[data-cy=add-project-button]').click()
  cy.get('[data-cy=project-form-heading]').should('contain', i18n.t('project.createNew'))
}
Cypress.Commands.add('navigateToAddProjectsForm', navigateToAddProjectsForm)

function navigateToEmployeeProjectsView() {
  cy.get('[data-testid=projects-nav]').should('contain', i18n.t('project.myProjectsLabel'))
  cy.get('[data-testid=projects-nav]').click()
  cy.get('[data-cy=projects-title]').should('contain', i18n.t('project.title'))
}
Cypress.Commands.add('navigateToEmployeeProjectsView', navigateToEmployeeProjectsView)

function navigateToBillingReportForm() {
  cy.get('[data-cy=reports-nav]').click()
  cy.get('[data-cy=billing-reports-nav]').should('contain', i18n.t(`report.billing.label`))
  cy.get('[data-cy=billing-reports-nav]').click()
  cy.get('[data-cy=reports-title]').should('contain', i18n.t('report.title'))
  cy.get('[data-cy=billing-reports-subtitle]').should(
    'contain',
    i18n.t(`report.billing.form.title`)
  )
}
Cypress.Commands.add('navigateToBillingReportForm', navigateToBillingReportForm)

function navigateToManagerSalaryReportForm() {
  cy.get('[data-cy=reports-nav]').click()
  cy.get('[data-cy=salary-reports-nav]').should('contain', i18n.t(`report.salary.label`))
  cy.get('[data-cy=salary-reports-nav]').click()
  cy.get('[data-cy=reports-title]').should('contain', i18n.t('report.title'))
  cy.get('[data-cy=salary-reports-subtitle]').should('contain', i18n.t(`report.salary.form.title`))
}
Cypress.Commands.add('navigateToManagerSalaryReportForm', navigateToManagerSalaryReportForm)

function navigateToEmployeeSalaryReportForm() {
  cy.get('[data-cy=salary-reports-nav]').should(
    'contain',
    i18n.t('report.salary.mySalaryReportLabel')
  )
  cy.get('[data-cy=salary-reports-nav]').click()
  cy.get('[data-cy=reports-title]').should('contain', i18n.t('report.title'))
  cy.get('[data-cy=salary-reports-subtitle]').should('contain', i18n.t('report.salary.form.title'))
}
Cypress.Commands.add('navigateToEmployeeSalaryReportForm', navigateToEmployeeSalaryReportForm)

// select

function selectAll(type: string) {
  cy.get(`[data-cy=select-all-${type}]`).click()
}
Cypress.Commands.add('selectAll', selectAll)

function selectOne(type: string, item: string) {
  cy.get(`[data-cy=select-${type}]`).click()
  cy.get('[role=listbox]>[role=option]').contains(item).click()
  cy.get(`[data-cy=select-${type}]`).should('contain', item)
}

function selectClient(client: string) {
  cy.get(`[data-cy=select-client]`).click({ scrollBehavior: false })
  cy.get('[role=listbox]>[role=option]').contains(client).click()
  cy.get(`[data-cy=select-client]`).should('contain', client)
}
Cypress.Commands.add('selectClient', selectClient)

function selectEmployee(employee: string) {
  selectOne('employee', employee)
}
Cypress.Commands.add('selectEmployee', selectEmployee)

function selectOwner(owner: string) {
  selectOne('owner', owner)
}
Cypress.Commands.add('selectOwner', selectOwner)

function selectUser(user: string) {
  selectOne('user', user)
}
Cypress.Commands.add('selectUser', selectUser)

function unselectOneEmployee(employee: string) {
  cy.get('[data-cy=select-multiple-employees]').click()
  cy.get('[role=listbox]>[role=option]').contains(employee).click()
  cy.get('body').click(0, 0)
  cy.get(`[data-cy=select-multiple-employees]`).should('not.contain', employee)
}
Cypress.Commands.add('unselectOneEmployee', unselectOneEmployee)

function selectOneFromMultiple(type: string, item: string) {
  cy.get(`[data-cy=select-multiple-${type}]`).click()
  cy.get('[role=listbox]>[role=option]').contains(item).click()
  cy.get('body').click(0, 0)
  cy.get(`[data-cy=select-multiple-${type}]`).should('contain', item)
}

function selectOneEmployeeFromMultiple(employee: string) {
  selectOneFromMultiple('employees', employee)
}
Cypress.Commands.add('selectOneEmployeeFromMultiple', selectOneEmployeeFromMultiple)

function selectOneClientFromMultiple(client: string) {
  selectOneFromMultiple('clients', client)
}
Cypress.Commands.add('selectOneClientFromMultiple', selectOneClientFromMultiple)

function selectOneProjectFromMultiple(project: string) {
  selectOneFromMultiple('projects', project)
}
Cypress.Commands.add('selectOneProjectFromMultiple', selectOneProjectFromMultiple)

// submit / generate

function submitProjectForm(projectName: string) {
  cy.get('[data-testId="projectFormSubmit"]').click()
  cy.get('[data-cy=alert]').should(
    'contain',
    i18n.t('project.message.createSuccess', { project: projectName })
  )
}
Cypress.Commands.add('submitProjectForm', submitProjectForm)

function submitEditProjectEmployeesForm(projectName: string) {
  cy.get('[data-testId=employeeDialogUpdate]').click()
  cy.get('[data-cy=alert]').should(
    'contain',
    i18n.t('project.message.updateSuccess', { project: projectName })
  )
}
Cypress.Commands.add('submitEditProjectEmployeesForm', submitEditProjectEmployeesForm)

function generateBillingReport(client: string) {
  cy.get('[data-testid=billingReportFormGenerate]').click()
  cy.get('[data-cy=alert]').should('contain', i18n.t('report.billing.message.success', { client }))
}
Cypress.Commands.add('generateBillingReport', generateBillingReport)

function generateSalaryReport(employee: string) {
  cy.get('[data-testid=salaryReportFormGenerate]').click()
  cy.get('[data-cy=alert]').should('contain', i18n.t('report.salary.message.success', { employee }))
}
Cypress.Commands.add('generateSalaryReport', generateSalaryReport)
