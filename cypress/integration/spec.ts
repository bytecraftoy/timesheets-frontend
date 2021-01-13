/// <reference types="cypress" />

describe('My First Test', () => {
  it('Does not do much!', () => {
    cy.visit('https://codeflow-timesheets-staging-fe.herokuapp.com/')
    expect(true).to.equal(true)
  })
})
