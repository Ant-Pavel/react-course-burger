import { TIngredient } from '@utils/types.ts';
import React from 'react';
import styles from './burger-constructor.module.css';
import {
	ConstructorElement,
	Button,
	CurrencyIcon,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerConstructorProps = {
	ingredients: TIngredient[];
	onCreateOrderClick: () => void;
};

export const BurgerConstructor = ({
	ingredients,
	onCreateOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
	console.log(ingredients);
	const [edgeEls, middleEls] = ingredients.reduce(
		(acc, ingredient) => {
			if (ingredient.type === 'bun') {
				acc[0].push(ingredient);
			} else {
				acc[1].push(ingredient);
			}

			return acc;
		},
		[[], []] as [Array<TIngredient>, Array<TIngredient>]
	);

	return (
		<section className={`${styles.burger_constructor} pb-10`}>
			<div className={styles.ingredients}>
				{
					<>
						{edgeEls.length && (
							<div className={`${styles.edgeIngredientWrap} pr-4`}>
								<ConstructorElement
									type='top'
									isLocked={true}
									text={`${edgeEls[0].name} (верх)`}
									price={edgeEls[0].price}
									thumbnail={edgeEls[0].image}
								/>
							</div>
						)}
						<div className={styles.middleIngredientsWrap}>
							{middleEls.map((el) => (
								<div key={el._id} className={styles.middleIngredientWrap}>
									<DragIcon type='primary' />
									<ConstructorElement
										text={el.name}
										price={el.price}
										thumbnail={el.image}
									/>
								</div>
							))}
						</div>

						{edgeEls.length && (
							<div className={`${styles.edgeIngredientWrap} pr-4`}>
								<ConstructorElement
									type='bottom'
									isLocked={true}
									text={`${edgeEls[0].name} (низ)`}
									price={edgeEls[0].price}
									thumbnail={edgeEls[0].image}
								/>
							</div>
						)}
					</>
				}
			</div>
			<div className={`${styles.bottomWrap} pr-4`}>
				<div className={styles.priceInfo}>
					<span className='text text_type_digits-medium mr-2'>610</span>
					<CurrencyIcon className={styles.priceInfo__icon} type='primary' />
				</div>
				<Button
					onClick={onCreateOrderClick}
					htmlType='button'
					type='primary'
					size='medium'
					extraClass='ml-10'>
					Оформить заказ
				</Button>
			</div>
		</section>
	);
};
