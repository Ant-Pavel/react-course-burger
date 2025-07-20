import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Home.module.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.tsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderDetails } from '@components/order-details/order-details.tsx';
import { Preloader } from '@components/preloader/preloader';
import { TIngredient } from '@utils/types.ts';
import { fetchIngredients } from '../../services/ingredients';
import { sendOrder } from '../../services/order';
import type { RootState, AppDispatch } from '../../services/store';
import { setIngredientDetails } from '../../services/ingredientDetails';
import { Outlet } from 'react-router-dom';

export const Home = (): React.JSX.Element => {
	const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);

	const dispatch: AppDispatch = useDispatch();
	const { ingredients, loading: isLoadingIngredients } = useSelector(
		(state: RootState) => state.ingredients
	);

	const isSendingOrder = useSelector((state: RootState) => state.order.loading);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	const onCreateOrderClick = async () => {
		await dispatch(sendOrder());
		setIsModalOrderOpen(true);
	};

	const onIngredientClick = (id: string) => {
		const ingredient = ingredients.find(
			(ingredientF) => ingredientF._id === id
		) as TIngredient;
		dispatch(
			setIngredientDetails({ ...ingredient, image: ingredient.image_large })
		);
	};

	return (
		<>
			{isLoadingIngredients || isSendingOrder ? (
				<Preloader />
			) : (
				<>
					<h1
						className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
						Соберите бургер
					</h1>
					<main className={`${styles.main} pl-5 pr-5`}>
						<DndProvider backend={HTML5Backend}>
							<BurgerIngredients
								ingredients={ingredients}
								onIngredientClick={onIngredientClick}
							/>
							<BurgerConstructor
								ingredients={ingredients}
								onCreateOrderClick={onCreateOrderClick}
							/>
						</DndProvider>
					</main>
					<Outlet />
					{isModalOrderOpen && (
						<Modal closeHandler={() => setIsModalOrderOpen(false)}>
							<OrderDetails />
						</Modal>
					)}
				</>
			)}
		</>
	);
};
