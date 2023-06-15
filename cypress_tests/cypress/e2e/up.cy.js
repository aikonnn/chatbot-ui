describe('Site Status', () => {
  it('visit main page', () => {
    cy.visit('http://localhost:3000/')
    cy.url().should("includes", "/auth/login")
  })
})