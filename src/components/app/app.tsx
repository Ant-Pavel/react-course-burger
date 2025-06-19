import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.tsx';
import { BurgerConstructor } from '@components/burger-contructor/burger-constructor.tsx';
import { AppHeader } from '@components/app-header/app-header.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderDetails } from '@components/order-details/order-details.tsx';
import {
	IngredientDetails,
	TIngredientDetails,
} from '@components/ingredient-details/ingredient-details.tsx';
import { ingredientsUrl } from '@/utils/api';
import { Preloader } from '../preloader/preloader';
import { TIngredient } from '@utils/types.ts';

export const App = (): React.JSX.Element => {
	const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
	const [isModalIngredientOpen, setIsModalIngredientOpen] = useState(false);
	const [ingredients, setIngredients] = useState<TIngredient[]>([]);
	const [isPreloaderShown, setIsPreloaderShown] = useState(true);
	const [currentIngredientDetails, setCurrentIngredientDetails] =
		useState<null | TIngredientDetails>(null);

	useEffect(() => {
		const getIngredients = async () => {
			try {
				const response = await fetch(ingredientsUrl);
				const responseParsed = await response.json();
				setIngredients(responseParsed.data);
				await new Promise((r) => setTimeout(r, 500));
			} catch (e) {
				console.log(e);
			} finally {
				setIsPreloaderShown(false);
			}
		};

		getIngredients();
	}, []);

	const onCreateOrderClick = () => {
		setIsModalOrderOpen(true);
	};

	const onIngredientClick = (id: string) => {
		const ingredient = ingredients.find(
			(ingredientF) => ingredientF._id === id
		) as TIngredient;
		setIsModalIngredientOpen(true);
		setCurrentIngredientDetails({
			...ingredient,
			image: ingredient.image_large,
		});
	};

	return (
		<div className={styles.app}>
			<>
				<AppHeader />
				{isPreloaderShown ? (
					<Preloader />
				) : (
					<>
						<h1
							className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
							Соберите бургер
						</h1>
						<main className={`${styles.main} pl-5 pr-5`}>
							<BurgerIngredients
								ingredients={ingredients}
								onIngredientClick={onIngredientClick}
							/>
							<BurgerConstructor
								ingredients={ingredients}
								onCreateOrderClick={onCreateOrderClick}
							/>
						</main>
						<Modal
							isOpen={isModalOrderOpen}
							closeHandler={() => setIsModalOrderOpen(false)}>
							<OrderDetails />
						</Modal>
						<Modal
							isOpen={isModalIngredientOpen}
							closeHandler={() => setIsModalIngredientOpen(false)}>
							<IngredientDetails
								ingredient={currentIngredientDetails as TIngredientDetails}
							/>
						</Modal>
					</>
				)}
			</>
		</div>
	);
};

export default App;
