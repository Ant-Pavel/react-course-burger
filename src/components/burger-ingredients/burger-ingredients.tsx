import React from 'react';
import styles from './burger-ingredients.module.css';
import { TIngredient } from '@utils/types.ts';
import {
	Tab,
	CurrencyIcon,
	Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientsProps = {
	ingredients: TIngredient[];
	onIngredientClick: (id: string) => void;
};

export const BurgerIngredients = ({
	ingredients,
	onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
	console.log(ingredients);

	const { buns, mains } = ingredients.reduce(
		(acc, ingredient) => {
			if (ingredient.type === 'bun') {
				acc.buns.push(ingredient);
			} else if (ingredient.type === 'main') {
				acc.mains.push(ingredient);
			} else if (ingredient.type === 'sauce') {
				acc.sauces.push(ingredient);
			}

			return acc;
		},
		{
			buns: [],
			mains: [],
			sauces: [],
		} as {
			buns: TIngredient[];
			mains: TIngredient[];
			sauces: TIngredient[];
		}
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
				<div className={styles.ingridientsBlock}>
					<h2 className='mb-6 text text_type_main-medium'>Булки</h2>
					<div className={styles.ingridientsBlock__list}>
						{buns.map((ingredientEl) => (
							<article
								key={ingredientEl._id}
								className={styles.ingridient}
								onClick={() => onIngredientClick(ingredientEl._id)}>
								<Counter count={1} size='default' extraClass='m-1' />
								<img src={ingredientEl.image} alt={ingredientEl.name} />
								<p className={`${styles.ingridient__pricewrap} pl-2 pr-2`}>
									<span className='mr-2 text text_type_digits-default'>
										{ingredientEl.price}
									</span>
									<CurrencyIcon type='primary' />
								</p>
								<p className='pl-2 pr-2 text text_type_main-default'>
									{ingredientEl.name}
								</p>
							</article>
						))}
					</div>
				</div>
				<div className={styles.ingridientsBlock}>
					<h2 className='mb-6 text text_type_main-medium'>Начинки</h2>
					<div className={styles.ingridientsBlock__list}>
						{mains.map((ingredientEl) => (
							<article
								key={ingredientEl._id}
								className={styles.ingridient}
								onClick={() => onIngredientClick(ingredientEl._id)}>
								<Counter count={1} size='default' extraClass='m-1' />
								<img src={ingredientEl.image} alt={ingredientEl.name} />
								<p className={`${styles.ingridient__pricewrap} pl-2 pr-2`}>
									<span className='mr-2  text text_type_digits-default'>
										{ingredientEl.price}
									</span>
									<CurrencyIcon type='primary' />
								</p>
								<p className='pl-2 pr-2 text text_type_main-default'>
									{ingredientEl.name}
								</p>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
