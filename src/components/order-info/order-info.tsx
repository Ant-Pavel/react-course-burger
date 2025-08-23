import { useAppDispatch, useAppSelector } from '@/services/store';
import { useEffect } from 'react';
import { Preloader } from '@/components/preloader/preloader';
import {
	CurrencyIcon,
	FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-info.module.css';
import { useParams } from 'react-router-dom';
import { loadOrder } from '@/services/order';
import { orderStatusesTranslation } from '@/utils/types';
import { getIngredientsDict, fetchIngredients } from '@/services/ingredients';

type IOrderInfoProps = {
	insideModal?: boolean;
};

export const OrderInfo = ({ insideModal }: IOrderInfoProps) => {
	const dispatch = useAppDispatch();
	const { number: orderNumberRouteParam } = useParams();
	const { ingredients, loading: isLoadingIngredients } = useAppSelector(
		(state) => state.ingredients
	);

	const order = useAppSelector((state) => {
		let foundOrder = state.ordersAll.orders.find(
			(order) => order.number === Number(orderNumberRouteParam)
		);
		if (foundOrder) return foundOrder;

		foundOrder = state.ordersUser.orders.find(
			(order) => order.number === Number(orderNumberRouteParam)
		);
		if (foundOrder) return foundOrder;

		return state.order.order;
	});
	const ingredientsDict = useAppSelector(getIngredientsDict);

	useEffect(() => {
		if (!order) {
			dispatch(loadOrder(Number(orderNumberRouteParam)));
		}
		if (!ingredients.length) {
			dispatch(fetchIngredients())
				.unwrap()
				.catch((err) => {
					console.log(err);
					// setShowLoadIngredientsErr(true);
				});
		}
	}, [dispatch, order, orderNumberRouteParam, ingredients]);

	if (isLoadingIngredients || !order || !ingredients) {
		return <Preloader />;
	}

	const { orderIngredientsCount, sum: orderTotalPrice } =
		order.ingredients.reduce(
			(acc, ingredientId) => {
				const { price } = ingredientsDict[ingredientId];
				acc.orderIngredientsCount[ingredientId] =
					(acc.orderIngredientsCount[ingredientId] || 0) + 1;
				acc.sum += price;
				return acc;
			},
			{ orderIngredientsCount: {} as Record<string, number>, sum: 0 }
		);

	return (
		<>
			<div
				className={`${!insideModal ? styles.onPageWrap : ''} ${styles.orderInfo}`}>
				<p
					className={`mt-5 mb-10 text text_type_digits-default ${!insideModal && 'text-center'}`}>
					#{order.number}
				</p>
				<p className='mb-3 text text_type_main-medium'>{order.name}</p>
				<p className='mb-15 text text_type_main-small text_color_success'>
					{orderStatusesTranslation[order.status]}
				</p>
				<p className='mb-6 text text_type_main-medium'>Состав:</p>
				<div className={`mb-10 ${styles.ordersIngredientsWrap}`}>
					{Object.entries(orderIngredientsCount).map(
						([ingredientId, count]) => (
							<div key={ingredientId} className={`mb-4 ${styles.orderIngr}`}>
								<div className={styles.orderIngrImage}>
									<img
										src={ingredientsDict[ingredientId].image}
										alt={ingredientsDict[ingredientId].name}
									/>
								</div>
								<p className='ml-4'>{ingredientsDict[ingredientId].name}</p>
								<div
									className={`ml-auto mr-6 pl-4 ${styles.orderIngrPriceWrap}`}>
									<span className='mr-2 feedItemPrice text text_type_digits-default'>
										{count} x {ingredientsDict[ingredientId].price}
									</span>
									<CurrencyIcon type='primary' />
								</div>
							</div>
						)
					)}
				</div>
				<div className={styles.bottomWrap}>
					<FormattedDate
						className='text text_type_main-default text_color_inactive text_type_main-small'
						date={new Date(order.createdAt)}
					/>
					<div className={`ml-auto pl-4 ${styles.priceWrap}`}>
						<span className='mr-2 feedItemPrice text text_type_digits-default'>
							{orderTotalPrice}
						</span>
						<CurrencyIcon type='primary' />
					</div>
				</div>
			</div>
		</>
	);
};
