import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/store';
import styles from './Home.module.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.tsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderDetails } from '@components/order-details/order-details.tsx';
import { Preloader } from '@components/preloader/preloader';
import { TIngredient } from '@utils/types.ts';
import { fetchIngredients } from '@/services/ingredients';
import { sendOrder } from '@/services/order';
import { setIngredientDetails } from '@/services/ingredientDetails';
import { Outlet, useNavigate } from 'react-router-dom';

export const Home = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
	const { ingredients, loading: isLoadingIngredients } = useAppSelector(
		(state) => state.ingredients
	);
	const [showLoadIngredientsErr, setShowLoadIngredientsErr] = useState(false);
	const [showCreateOrderErr, setShowCreateOrderErr] = useState(false);

	const isSendingOrder = useAppSelector((state) => state.order.loading);
	const user = useAppSelector((state) => state.auth.user);

	useEffect(() => {
		dispatch(fetchIngredients())
			.unwrap()
			.catch((err) => {
				console.log(err);
				setShowLoadIngredientsErr(true);
			});
	}, [dispatch]);

	const onCreateOrderClick = async () => {
		if (!user) {
			navigate('/login');
			return;
		}
		try {
			await dispatch(sendOrder()).unwrap();
			setIsModalOrderOpen(true);
		} catch (error) {
			console.error('Error sending order:', error);
			setShowCreateOrderErr(true);
		}
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
			{isLoadingIngredients ? (
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
							<BurgerConstructor onCreateOrderClick={onCreateOrderClick} />
						</DndProvider>
					</main>
					<Outlet />
					{isModalOrderOpen && (
						<Modal closeHandler={() => setIsModalOrderOpen(false)}>
							<OrderDetails />
						</Modal>
					)}
					{showLoadIngredientsErr && (
						<Modal closeHandler={() => setShowLoadIngredientsErr(false)}>
							<div className='p-25 text-center'>
								<p className='text text_type_main-medium'>
									Ой. Ошибка загрузки ингредиентов
								</p>
							</div>
						</Modal>
					)}
					{showCreateOrderErr && (
						<Modal closeHandler={() => setShowCreateOrderErr(false)}>
							<div className='p-25 text-center'>
								<p className='text text_type_main-medium'>
									Ой. Ошибка создания заказа
								</p>
							</div>
						</Modal>
					)}
					{isSendingOrder && (
						<Modal closeHandler={() => setShowCreateOrderErr(false)}>
							<div className='p-15 text-center'>
								<p className='mb-10 text text_type_main-medium'>
									Обрабатываем ваш заказ
								</p>
								<Preloader />
							</div>
						</Modal>
					)}
				</>
			)}
		</>
	);
};
