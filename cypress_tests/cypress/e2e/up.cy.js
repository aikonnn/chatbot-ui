describe('Site Status', () => {
  it('visit main page', () => {
    cy.visit('http://chatgpt:3000/')
    cy.url().should("includes", "/auth/login")
    cy.contains('Login with DEX').click()
    cy.url().should("include", "/dex/auth")
  })
})