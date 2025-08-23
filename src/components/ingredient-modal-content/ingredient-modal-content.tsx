import { useAppSelector } from '@/services/store';
import { useParams } from 'react-router-dom';
import { getIngredientById } from '../../services/ingredients';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Preloader } from '../preloader/preloader';

export const IngredientModalContent = (): React.JSX.Element => {
	const ingredientId: string | undefined =
		useParams<'ingredientId'>().ingredientId;

	const ingredient = useAppSelector((state) => {
		return getIngredientById(state, ingredientId as string);
	})!;

	if (!ingredient) return <Preloader />;

	return (
		<div className='mt-4'>
			<IngredientDetails ingredient={ingredient} />
		</div>
	);
};
