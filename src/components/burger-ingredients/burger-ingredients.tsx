import React, { useRef, useState, useCallback, useMemo } from 'react';
import styles from './burger-ingredients.module.css';
import { TIngredient } from '@utils/types.ts';
import { Ingredient } from '../ingredient/ingredient';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { selectIngredientsCount } from '../../services/burgerConstructor';
import { useSelector } from 'react-redux';

type TBurgerIngredientsProps = {
	ingredients: TIngredient[];
	onIngredientClick: (id: string) => void;
};

export const BurgerIngredients = ({
	ingredients,
	onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
	const headerRefs = useRef<{ [key: string]: HTMLHeadingElement | null }>({});
	const ingredientsTabContentRef = useRef<HTMLUListElement | null>(null);
	const [currentTabName, setCurrentTabName] = useState('Булки');

	const setHeaderRef = useCallback(
		(name: string) => (element: HTMLHeadingElement | null) => {
			headerRefs.current[name] = element;
		},
		[]
	);

	const ingredientBlocks = useMemo(
		() =>
			ingredients.reduce(
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
			),
		[ingredients]
	);

	const onScrollIngredientsHandler = () => {
		const tabContentTop =
			ingredientsTabContentRef.current?.getBoundingClientRect().top ?? 0;
		const diffsDict = Object.fromEntries(
			Object.entries(headerRefs.current).map(([name, header]) => {
				const headerTop = header?.getBoundingClientRect().top ?? 0;
				return [Math.abs(tabContentTop - headerTop), name];
			})
		);
		const closestHeaderName =
			diffsDict[Math.min(...Object.keys(diffsDict).map(Number))];
		setCurrentTabName(closestHeaderName);
	};

	const tabClickHandler = (tabValue: string) => {
		if (!headerRefs.current[tabValue]) return;
		ingredientsTabContentRef.current?.scrollTo({
			top: headerRefs.current[tabValue]?.offsetTop - 40,
			behavior: 'smooth',
		});
	};

	const ingredientsCount = useSelector(selectIngredientsCount);

	return (
		<section className={styles.burger_ingredients}>
			<nav>
				<ul className={styles.menu}>
					<li>
						<Tab
							value='Булки'
							active={currentTabName === 'Булки'}
							onClick={tabClickHandler}>
							Булки
						</Tab>
					</li>
					<li>
						<Tab
							value='Начинки'
							active={currentTabName === 'Начинки'}
							onClick={tabClickHandler}>
							Начинки
						</Tab>
					</li>
					<li>
						<Tab
							value='Соусы'
							active={currentTabName === 'Соусы'}
							onClick={tabClickHandler}>
							Соусы
						</Tab>
					</li>
				</ul>
			</nav>
			<ul
				ref={ingredientsTabContentRef}
				className={styles.tabContent}
				onScroll={onScrollIngredientsHandler}>
				{Object.entries(ingredientBlocks).map(([name, ingredients]) => (
					<li key={name} className={styles.ingridientsBlock}>
						<h2
							ref={setHeaderRef(name)}
							className='mb-6 text text_type_main-medium'>
							{name}
						</h2>
						<div className={styles.ingridientsBlock__list}>
							{ingredients.map((ingredientEl) => (
								<Ingredient
									key={ingredientEl._id}
									onClickHandler={onIngredientClick}
									id={ingredientEl._id}
									name={ingredientEl.name}
									price={ingredientEl.price}
									image={ingredientEl.image}
									count={ingredientsCount[ingredientEl._id] || 0}
									type={ingredientEl.type}
								/>
							))}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};
