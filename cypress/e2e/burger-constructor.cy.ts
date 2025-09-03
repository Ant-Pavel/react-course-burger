import type {} from '../support/cypress';
/// <reference types="cypress" />

describe('template spec', () => {
	const ingredientModalContentSelector =
		'[data-testid=ingredient-modal-content]';
	const ingredientIdAttrName = 'data-testidingredientid';
	const modalCloseButtonSelector = '[data-testid=modal-close-button]';

	beforeEach(() => {
		cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
		cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
		cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
			'sendOrder'
		);
		window.localStorage.setItem('accessToken', 'qwerty');
	});

	it("opening ingredient's modal", () => {
		const element = cy.checkIngredientsModalPreparation(
			ingredientModalContentSelector
		);
		element.invoke('attr', ingredientIdAttrName).then((ingredientId) => {
			cy.location('pathname').should('equal', `/ingredient/${ingredientId}`);
			cy.get(ingredientModalContentSelector).should('be.visible');
			cy.get(ingredientModalContentSelector).contains('Детали ингредиента');
		});
	});

	it("closing ingredient's modal on close btn click", () => {
		const element = cy.checkIngredientsModalPreparation(
			ingredientModalContentSelector
		);
		element.invoke('attr', ingredientIdAttrName).then((ingredientId) => {
			cy.location('pathname').should('equal', `/ingredient/${ingredientId}`);
			cy.get(ingredientModalContentSelector).should('exist');
			cy.get(modalCloseButtonSelector).click();
			cy.get(ingredientModalContentSelector).should('not.exist');
		});
	});

	it("closing ingredient's modal on overlay click", () => {
		const element = cy.checkIngredientsModalPreparation(
			ingredientModalContentSelector
		);
		element.invoke('attr', ingredientIdAttrName).then((ingredientId) => {
			cy.location('pathname').should('equal', `/ingredient/${ingredientId}`);
			cy.get(ingredientModalContentSelector).should('exist');
			cy.get('[data-testid=modal-overlay]').click({ force: true });
			cy.get(ingredientModalContentSelector).should('not.exist');
		});
	});

	it('moving bun ingredient to constructor', () => {
		cy.checkDraggingPreparation();
		cy.dragIngredientToConstructor('643d69a5c3f7b9001cfa093c');

		cy.checkBunAddedToConstructor(
			'constructor-bun-top-block',
			'Краторная булка N-200i'
		);
		cy.checkBunAddedToConstructor(
			'constructor-bun-bottom-block',
			'Краторная булка N-200i'
		);
	});

	it('moving main ingredient to constructor', () => {
		cy.checkDraggingPreparation();
		cy.dragIngredientToConstructor('643d69a5c3f7b9001cfa093e');
		cy.dragIngredientToConstructor('643d69a5c3f7b9001cfa0942');

		cy.get('[data-testid=constructor-main-ingredients-block]')
			.as('constructorDropZone')
			.should('exist');
		cy.get('@constructorDropZone').children().should('have.length', 2);

		cy.get('@constructorDropZone').contains('Соус Spicy-X');
		cy.get('@constructorDropZone').contains(
			'Филе Люминесцентного тетраодонтимформа'
		);
	});

	it('checkOrderCreation', () => {
		const orderDetailModalSelector = '[data-testid=orderDetailsModalContent]';
		cy.checkDraggingPreparation();
		cy.get(orderDetailModalSelector).should('not.exist');

		cy.dragIngredientToConstructor('643d69a5c3f7b9001cfa093c');
		cy.dragIngredientToConstructor('643d69a5c3f7b9001cfa093e');
		cy.dragIngredientToConstructor('643d69a5c3f7b9001cfa0942');

		cy.get('[data-testid=constructor-order-button]').click();
		cy.wait('@sendOrder');
		cy.get(orderDetailModalSelector).should('exist');
		cy.get(orderDetailModalSelector).contains('87592');

		cy.get(modalCloseButtonSelector).click();
		cy.checkConstructorIsEmpty();
	});
});
