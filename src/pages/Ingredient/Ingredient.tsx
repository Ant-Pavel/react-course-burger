import React, { useEffect, useState } from 'react';
import styles from './Ingredient.module.css';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { fetchIngredients } from '@/services/ingredients';
import { Preloader } from '@/components/preloader/preloader';
import { useParams, useNavigate } from 'react-router-dom';
import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import type { TIngredient } from '@/utils/types';

export const Ingredient = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { ingredientId } = useParams<'ingredientId'>();
	const [ingredient, setIngredient] = useState<null | TIngredient>(null);
	const { loading: isLoadingIngredients } = useAppSelector(
		(state) => state.ingredients
	);

	useEffect(() => {
		const loadIngredients = async () => {
			const fetchIngredientsRes = await dispatch(fetchIngredients()).unwrap();
			if (!fetchIngredientsRes.success) return;
			const ingredients = fetchIngredientsRes.data;
			const ingredient = ingredients.find(
				(ingr: TIngredient) => ingr._id === ingredientId
			);
			if (ingredient) {
				setIngredient(ingredient);
			} else {
				navigate('/');
			}
		};
		loadIngredients();
	}, [dispatch, navigate, ingredientId]);

	if (isLoadingIngredients || !ingredient) {
		return <Preloader />;
	}

	return (
		<>
			<div className={`${styles.ingredientWrap} pt-3 pb-5`}>
				<IngredientDetails ingredient={ingredient} />
			</div>
		</>
	);
};
