describe('Crawl Bahmutov github repositories', () => {
  it('Visit every link from the repos list', () => {
    cy.visit('https://github.com/bahmutov?tab=repositories')
    const links = []
    function crawl() {
      cy.get('body').then(body => {
        const link = body[0].querySelectorAll('a.next_page')
        if (link.length > 0) {
          cy.wait(500)
          cy.get('ul[data-filterable-for="your-repos-filter"] h3 a').then(
            $links => {
              links.push(
                ...$links.toArray().map(link => link.getAttribute('href'))
              )
            }
          )
          cy.contains('a', 'Next').click().then(crawl)
        } else {
          return
        }
      })
    }
    crawl()
    cy.wrap(links).then(links => {
      let stars = 0
      let counter = 5
      for (let link of links) {
        if (counter > 0) {
          cy.visit(`https://github.com/${link}`)
          cy.get('.BorderGrid-row .mt-2 a strong')
            .eq(0)
            .invoke('text')
            .then(text => {
              stars += parseInt(text)
              cy.log(
                `for ${
                  6 - counter
                } newest repositories there are totally ${stars} number of stars`
              )
            })
          counter--
        } else {
          break
        }
      }
    })
  })
  it('doesnt fail', () => {
    cy.visit('https://github.com/bahmutov?tab=repositories')
    cy.contains('Privacy').should(Cypress._.noop).invoke('attr', 'href')
  })
})
