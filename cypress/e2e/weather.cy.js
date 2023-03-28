import 'cypress-map'
chai.config.truncateThreshold = 1000

describe('template spec', () => {
  it('create an array of 10 random cities in Spain', () => {
    cy.visit('list-cities-spain/')
    cy.get('td:nth-child(1)')
      .should('have.length.gte', 10)
      .then(function ($cells) {
        return Cypress._.sampleSize($cells.toArray(), 10)
      })
      .should('have.length', 10)
      .as('cities')
    let arr = []
    cy.get('@cities').each(city => {
      if (city.text() !== 'Name') {
        arr.push(
          city.text().replace('\n', '')
          // .replace(/\[\w\]/, '')
        )
      }
    })
    cy.wrap(arr).then(arr => cy.writeFile('cities.json', arr))
    cy.get('@cities').map('innerText').print('cities %o')
  })
  it('Prints to console the weather temp for the first city in the array', () => {
    cy.readFile('cities.json').then(cities => {
      const cityName = cities[0]
      cy.request(`https://wttr.in/${cityName}?format=j1`)
        .its('body')
        // cy.tap() // comes from cypress-map
        //and by default prints the current subject using console.log
        .tap()
        .its('weather.0.avgtempC')
        // cy.print in cypress - map
        .print(`${cityName} average tomorrow is %dC`)
      // .then(body => {
      //   cy.log(
      //     `${cityName} temperature tomorrow is ${body.weather[0].avgtempC}C`
      //   )
      // })
    })
  })
  it('fetches weather for the first city anf outputs it in html format', () => {
    cy.readFile('cities.json')
      .its(0)
      .then(cityName => {
        cy.request(`https://wttr.in/${cityName}`)
          .its('body')
          .then(html => {
            cy.document().invoke({ log: false }, 'write', html)
          })
      })
  })
  it('Uses recursin and fetches weather until we find a comfortable city', () => {
    const getForecast = cities => {
      if (cities.length < 1) {
        cy.log('No more cities to check')
        return
      }
      cy.print(`${cities.length} cities remaining`)
      // always check the last city
      // and remove it from the remaining list
      const cityName = cities.pop()
      cy.request(`https://wttr.in/${cityName}?format=j1`)
        .its('body')
        // cy.tap() comes from cypress-map
        // and by default prints the current subject using console.log
        .tap()
        .its('weather.0.avgtempC')
        .print(`${cityName} average tomorrow is %dC`)
        .then(temperature => {
          if (temperature >= 17 && temperature <= 25) {
            cy.log(`People in ${cityName} are lucky`)
          } else {
            // call the weather check again
            // with the shorter list of cities to check
            getForecast(cities)
          }
        })
    }
    cy.readFile('cities.json')
      // kick off the search
      .then(getForecast)
  })
})
