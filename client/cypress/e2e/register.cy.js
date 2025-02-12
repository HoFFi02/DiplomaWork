import 'cypress-drag-drop';

describe('Rejestracja użytkownika', () => {
  it('powinna zarejestrować nowego użytkownika', () => {
    cy.visit('http://localhost:5173/register')
    cy.get('input[placeholder="Nazwa użytkownika"]').type('nowyUzytkownik'); 
    cy.get('input[placeholder="Hasło"]').type('BezpieczneHaslo123');
    cy.get('input[placeholder="Email"]').type('test@example.com'); 
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:5173/');
  });
});
describe('Logowanie', () => {
  it('powinna zalogować użytkownika', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Nazwa użytkownika"]').type('nowyUzytkownik'); 
    cy.get('input[placeholder="Hasło"]').type('BezpieczneHaslo123');
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:5173/home');
  });
});
describe('Przeciąganie przepisu na ostatni dzień', () => {
  it('powinno przeciągnąć pierwszy przepis na ostatni dzień i sprawdzić, czy został dodany', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Nazwa użytkownika"]').type('nowyUzytkownik'); 
    cy.get('input[placeholder="Hasło"]').type('BezpieczneHaslo123');
    cy.get('button[type="submit"]').click();


    cy.get('tr[draggable="true"]').first().as('pierwszyPrzepis');

    cy.get('@pierwszyPrzepis').find('td').first().invoke('text').as('nazwaPrzepisu');

    
    cy.get('.meal-cell').last().as('ostatniDzien');

    
    cy.get('@pierwszyPrzepis').trigger('dragstart'); 
    cy.get('@ostatniDzien')
      .trigger('dragover') 
      .trigger('drop');

    cy.get('@nazwaPrzepisu').then((nazwaPrzepisu) => {
      cy.get('@ostatniDzien').should('contain', nazwaPrzepisu.trim());
    });
  });
});

describe('Przeciąganie przepisu i sprawdzenie składników', () => {
  it('powinno przeciągnąć przepis na ostatni dzień, a następnie sprawdzić składniki w modalnym oknie oraz na liście zakupów', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Nazwa użytkownika"]').type('nowyUzytkownik'); 
    cy.get('input[placeholder="Hasło"]').type('BezpieczneHaslo123');
    cy.get('button[type="submit"]').click();
    
    cy.get('tr[draggable="true"]').first().as('pierwszyPrzepis');

    
    cy.get('@pierwszyPrzepis').find('td').first().invoke('text').as('nazwaPrzepisu');
    
    
    cy.get('@pierwszyPrzepis').find('td').eq(1).invoke('text').then((skladnikiPrzepisu) => {
      cy.log('Pobrane składniki: ' + skladnikiPrzepisu);
     
      cy.wrap(skladnikiPrzepisu).as('skladnikiPrzepisu');
    });
    
    
    cy.get('@skladnikiPrzepisu').then((skladnikiPrzepisu) => {
      cy.log('Pobrane składniki: ' + skladnikiPrzepisu);
    });
    
    
    cy.get('.meal-cell').last().as('ostatniDzien');

    
    cy.get('@pierwszyPrzepis').trigger('dragstart');
    cy.get('@ostatniDzien')
      .trigger('dragover') 
      .trigger('drop'); 

    
    cy.get('@nazwaPrzepisu').then((nazwaPrzepisu) => {
      cy.get('@ostatniDzien').should('contain', nazwaPrzepisu.trim());
    });

    cy.contains('Plan').click(); 
    
    cy.get('.show-button').click();

    
    cy.contains('Lista zakupów').click(); 
    cy.wait(1000);

    
    cy.get('tbody').find('tr').each(($row, index) => {
     
      cy.wrap($row).find('td').eq(0).invoke('text').as(`skladnik${index}`);
      cy.wrap($row).find('td').eq(1).invoke('text').as(`ilosc${index}`);
      cy.wrap($row).find('td').eq(2).invoke('text').as(`jednostka${index}`);
      
      
      cy.get(`@skladnik${index}`).then(skladnik => {
        cy.log(`Składnik ${index + 1}: ${skladnik}`);
      });
      cy.get(`@ilosc${index}`).then(ilosc => {
        cy.log(`Ilość ${index + 1}: ${ilosc}`);
      });
      cy.get(`@jednostka${index}`).then(jednostka => {
        cy.log(`Jednostka ${index + 1}: ${jednostka}`);
      });
    });

    
    let formattedSkładnikiZakupy = [];
    cy.get('tbody').find('tr').each(($row, index) => {
      cy.wrap($row).find('td').eq(0).invoke('text').then(skladnik => {
        cy.wrap($row).find('td').eq(1).invoke('text').then(ilosc => {
          cy.wrap($row).find('td').eq(2).invoke('text').then(jednostka => {
            const formattedSkladnik = `${skladnik.trim()} (${ilosc.trim()} ${jednostka.trim()})`;
            formattedSkładnikiZakupy.push(formattedSkladnik);
            cy.log(`Sformatowany składnik: ${formattedSkladnik}`);
          });
        });
      });
    });

   
    cy.get('@skladnikiPrzepisu').then((skladnikiPrzepisu) => {
      
      formattedSkładnikiZakupy.forEach(skladnik => {
        cy.log(`Porównanie składnika: ${skladnik}`);
        expect(skladnikiPrzepisu).to.contain(skladnik);
      });
    });
  });
});
