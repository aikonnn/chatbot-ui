describe('Site Status', () => {
  it('visit main page', () => {
    Cypress.Cookies.debug(true)

    cy.visit('http://chatgpt:3000/')
    cy.url().should("includes", "/auth/login")
    cy.contains('Login with DEX').click()
    

    cy.origin('http://dex:5556/', () => {
      cy.url().should("include", "/dex/auth")
      cy.get('#password').type('password')
      cy.get('#login').type('admin@example.com')
      cy.get('#submit-login').click()

      cy.wait(2500)

      cy.get(".dex-btn.theme-btn--success").click()
    })

    cy.getCookies()
    .should('have.length', 4)
    .then((cookies) => {
      cy.log(cookies[0].name)
      cy.log(cookies[1].name)
      cy.log(cookies[2].name)
      cy.log(cookies[3].name)
    })

    cy.wait(10000)

    cy.url().should('equal', 'http://chatgpt:3000/')
    

  })
})