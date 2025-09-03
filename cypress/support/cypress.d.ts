import './commands';

declare global {
	namespace Cypress {
		interface Chainable {
			checkDraggingPreparation(): void;
			checkConstructorIsEmpty(): void;
			dragIngredientToConstructor(ingredientId: string): void;
			checkBunAddedToConstructor(
				dataTestId: string,
				ingredientName: string
			): void;
			checkIngredientsModalPreparation(
				ingredientModalContentSelector: string
			): Cypress.Chainable<JQuery<HTMLElement>>;
		}
	}
}
