/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('checkConstructorIsEmpty', () => {
	cy.get('[data-testid=constructor-bun-top-block]').should('not.exist');
	cy.get('[data-testid=constructor-bun-bottom-block]').should('not.exist');
	cy.get('[data-testid=constructor-main-ingredients-block]').should(
		'not.exist'
	);
});

Cypress.Commands.add('checkDraggingPreparation', () => {
	cy.visit('/');
	cy.checkConstructorIsEmpty();
});

Cypress.Commands.add('dragIngredientToConstructor', (ingredientId) => {
	cy.get(`[data-testidingredientid=${ingredientId}]`).trigger('dragstart');
	cy.get('[data-testid=constructor]').trigger('drop');
});

Cypress.Commands.add(
	'checkBunAddedToConstructor',
	(dataTestId, ingredientName) => {
		cy.get(`[data-testid=${dataTestId}]`)
			.as('constructorTopBunDropZone')
			.should('exist');
		cy.get('@constructorTopBunDropZone').children().should('have.length', 1);
		cy.get('@constructorTopBunDropZone').contains(ingredientName);
	}
);

Cypress.Commands.add(
	'checkIngredientsModalPreparation',
	(ingredientModalContentSelector) => {
		cy.visit('/');
		cy.get(ingredientModalContentSelector).should('not.exist');
		return cy.get('[data-testid=burger-ingredient]').first().click();
	}
);
