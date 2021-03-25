/* eslint-disable jest/no-disabled-tests */
/// <reference types="cypress" />

describe('project view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should show projects view', () => {
    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=projects-title]').should('contain', 'Projects')
  })
})

describe('add project', () => {
  it('should open add projects form', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid=projects-nav]').click()
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-form-heading]').should('contain', 'Create new project')
  })

  it('should input project name', () => {
    cy.get('input[name="name"]').type('cypress testi projekti')
    cy.get('input[name="name"]').should('have.value', 'cypress testi projekti')
  })

  it('should input project description', () => {
    cy.get('textarea[name="description"]').type('cypress testi projektin kuvaus')
    cy.get('textarea[name="description"]').should('have.value', 'cypress testi projektin kuvaus')
  })

  // TODO: is it possible to select the first item on the list
  it('should select a client', () => {
    cy.get('[data-cy=select-client]').click()
    cy.contains('Esimerkkiasiakas').click()
    cy.get('[data-cy=select-client]').should('contain', 'Esimerkkiasiakas')
  })

  it('should select an owner', () => {
    cy.get('[data-cy=select-owner]').click()
    cy.contains('Eka E_sukunimi').click()
    cy.get('[data-cy=select-owner]').should('contain', 'Eka E_sukunimi')
  })

  it('should add a new project succesfully', () => {
    cy.get('[data-testId="projectFormSubmit"]').click()
    cy.get('[data-cy=alert]').should('contain', 'cypress testi projekti created succesfully!')
    cy.get('[data-cy=projects-table]').should('contain', 'cypress testi projekti')
  })
})
