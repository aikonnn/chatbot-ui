describe('Site Status', () => {
  it('visit main page', () => {
    cy.visit('http://chatgpt:3000/')
    cy.url().should("includes", "/auth/login")
    cy.contains('Login with DEX').click()
    cy.origin('http://dex:5556/', () => {
      cy.url().should("include", "/dex/auth")
      cy.get('#password').type('password')
      cy.get('#login').type('admin@example.com')
      cy.get('#submit-login').click()

      cy.get(".dex-btn.theme-btn--success").click()
    })
  })
})