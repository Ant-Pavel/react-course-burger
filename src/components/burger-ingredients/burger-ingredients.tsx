import React from 'react';
import styles from './burger-ingredients.module.css';
import { TIngredient } from '@utils/types.ts';
import { Ingredient } from '../ingredient/ingredient';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientsProps = {
	ingredients: TIngredient[];
	onIngredientClick: (id: string) => void;
};

export const BurgerIngredients = ({
	ingredients,
	onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
	console.log(ingredients);

	const ingredientBlocks = ingredients.reduce(
		(acc, ingredient) => {
			if (ingredient.type === 'bun') {
				if (!acc['Булки']) acc['Булки'] = [];
				acc['Булки'].push(ingredient);
			} else if (ingredient.type === 'main') {
				if (!acc['Начинки']) acc['Начинки'] = [];
				acc['Начинки'].push(ingredient);
			} else if (ingredient.type === 'sauce') {
				if (!acc['Соусы']) acc['Соусы'] = [];
				acc['Соусы'].push(ingredient);
			}

			return acc;
		},
		{} as { [key: string]: TIngredient[] }
	);
	return (
		<section className={styles.burger_ingredients}>
			<nav>
				<ul className={styles.menu}>
					<Tab value='bun' active={true} onClick={() => {}}>
						Булки
					</Tab>
					<Tab value='main' active={false} onClick={() => {}}>
						Начинки
					</Tab>
					<Tab value='sauce' active={false} onClick={() => {}}>
						Соусы
					</Tab>
				</ul>
			</nav>
			<div className={styles.tabContent}>
				{Object.entries(ingredientBlocks).map(([name, ingredients]) => (
					<div key={name} className={styles.ingridientsBlock}>
						<h2 className='mb-6 text text_type_main-medium'>{name}</h2>
						<div className={styles.ingridientsBlock__list}>
							{ingredients.map((ingredientEl) => (
								<Ingredient
									key={ingredientEl._id}
									onClickHandler={onIngredientClick}
									id={ingredientEl._id}
									name={ingredientEl.name}
									price={ingredientEl.price}
									image={ingredientEl.image}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
