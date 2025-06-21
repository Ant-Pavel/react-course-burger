import styles from './ingredient.module.css';
import {
	Counter,
	CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

type TBurgerIngredientProps = {
	onClickHandler: (id: string) => void;
	id: string;
	name: string;
	price: number;
	image: string;
};

export const Ingredient = ({
	id,
	name,
	price,
	image,
	onClickHandler,
}: TBurgerIngredientProps): React.JSX.Element => {
	return (
		<article className={styles.ingridient} onClick={() => onClickHandler(id)}>
			<Counter count={1} size='default' extraClass='m-1' />
			<img src={image} alt={name} />
			<p className={`${styles.ingridient__pricewrap} pl-2 pr-2`}>
				<span className='mr-2 text text_type_digits-default'>{price}</span>
				<CurrencyIcon type='primary' />
			</p>
			<p className='pl-2 pr-2 text text_type_main-default'>{name}</p>
		</article>
	);
};
