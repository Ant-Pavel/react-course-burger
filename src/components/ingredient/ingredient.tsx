import styles from './ingredient.module.css';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { TIngredient } from '@/utils/types';
interface TBurgerIngredientProps
	extends Pick<TIngredient, 'name' | 'price' | 'image' | 'type'> {
	id: string;
	count: number;
	onClickHandler: (id: string) => void;
}

export const Ingredient = ({
	id,
	name,
	price,
	image,
	count,
	type,
	onClickHandler,
}: TBurgerIngredientProps): React.JSX.Element => {
	const [, dragRef] = useDrag(() => ({
		type: 'ingredient',
		item: { id, type },
	}));

	return (
		<article className={styles.ingridient} onClick={() => onClickHandler(id)}>
			{count > 0 && <Counter count={count} size='default' extraClass='m-1' />}
			<img
				ref={dragRef}
				src={image}
				alt={name}
				className={styles.ingridient__img}
			/>
			<p className={`${styles.ingridient__pricewrap} pl-2 pr-2`}>
				<span className='mr-2 text text_type_digits-default'>{price}</span>
				<CurrencyIcon type='primary' />
			</p>
			<p className='pl-2 pr-2 text text_type_main-default'>{name}</p>
		</article>
	);
};
