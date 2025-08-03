import React from 'react';
import styles from './burger-constructor.module.css';
import {
	removeIngredient,
	getTotalPriceSelector,
	addIngredientById,
} from '../../services/burgerConstructor';
import type { RootState, AppDispatch } from '../../services/store';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
	ConstructorElement,
	Button,
	CurrencyIcon,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { BurgerConstructorEmptyZone } from '../burger-constructor-empty-zone/burger-constructor-empty-zone.tsx';
import { BurgerConstructorSortableIngredientWrap } from '../burger-constructor-sortable-ingredient-wrap/burger-constructor-sortable-ingredient-wrap.tsx';
import type { TDraggingIngredientItem } from '@/utils/types.ts';

type TBurgerConstructorProps = {
	onCreateOrderClick: () => void;
};

export const BurgerConstructor = ({
	onCreateOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
	const dispatch: AppDispatch = useDispatch();
	const { bun, ingredients } = useSelector(
		(state: RootState) => state.burgerConstructor
	);

	const [{ draggedItem }, dropRef] = useDrop<
		TDraggingIngredientItem,
		unknown,
		{ draggedItem: TDraggingIngredientItem | undefined }
	>(() => ({
		accept: 'ingredient',
		drop: (item: TDraggingIngredientItem) => {
			dispatch(addIngredientById(item.id));
		},
		collect: (monitor) => ({
			draggedItem: monitor.getItem(),
		}),
	}));

	const removeIngredientHandler = (constructorId: string): void => {
		dispatch(removeIngredient(constructorId));
	};

	const totalPrice = useSelector(getTotalPriceSelector);

	return (
		<section className={`${styles.burger_constructor} pb-10`}>
			<div className={styles.ingredients} ref={dropRef}>
				{
					<>
						{bun ? (
							<div className={`${styles.edgeIngredientWrap} pr-4`}>
								<ConstructorElement
									type='top'
									isLocked={true}
									text={`${bun.name} (верх)`}
									price={bun.price}
									thumbnail={bun.image}
								/>
							</div>
						) : (
							<BurgerConstructorEmptyZone
								type='top'
								droppable={draggedItem && draggedItem.type === 'bun'}>
								Выберите булку
							</BurgerConstructorEmptyZone>
						)}
						{ingredients.length ? (
							<div className={styles.middleIngredientsWrap}>
								{ingredients.map((el, index) => (
									<BurgerConstructorSortableIngredientWrap
										key={el.construcrorId}
										id={el.construcrorId}
										index={index}>
										<div className={styles.middleIngredientWrap}>
											<DragIcon type='primary' />
											<ConstructorElement
												text={el.name}
												price={el.price}
												thumbnail={el.image}
												handleClose={() =>
													removeIngredientHandler(el.construcrorId)
												}
											/>
										</div>
									</BurgerConstructorSortableIngredientWrap>
								))}
							</div>
						) : (
							<BurgerConstructorEmptyZone
								droppable={draggedItem && draggedItem.type !== 'bun'}>
								Выберите начинку
							</BurgerConstructorEmptyZone>
						)}
						{bun ? (
							<div className={`${styles.edgeIngredientWrap} pr-4`}>
								<ConstructorElement
									type='bottom'
									isLocked={true}
									text={`${bun.name} (низ)`}
									price={bun.price}
									thumbnail={bun.image}
								/>
							</div>
						) : (
							<BurgerConstructorEmptyZone
								type='bottom'
								droppable={draggedItem && draggedItem.type === 'bun'}>
								Выберите булку
							</BurgerConstructorEmptyZone>
						)}
					</>
				}
			</div>
			<div className={`${styles.bottomWrap} pr-4`}>
				<div className={styles.priceInfo}>
					<span className='text text_type_digits-medium mr-2'>
						{totalPrice}
					</span>
					<CurrencyIcon className={styles.priceInfo__icon} type='primary' />
				</div>
				<Button
					onClick={onCreateOrderClick}
					htmlType='button'
					type='primary'
					size='medium'
					extraClass='ml-10'
					disabled={totalPrice === 0}>
					Оформить заказ
				</Button>
			</div>
		</section>
	);
};
