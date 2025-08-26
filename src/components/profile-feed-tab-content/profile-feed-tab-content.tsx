import styles from './profile-feed-tab-content.module.css';
import {
	wsConnect,
	wsDisconnect,
} from '@/services/actions/ordersUserSocketActions';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { wsOrdersUserUrl } from '@/utils/httpApi';
import { getIngredientsDict } from '@/services/ingredients';
import { Preloader } from '@components/preloader/preloader';
import { FeedOrdersList } from '@components/feed-orders-list/feed-orders-list';

export const ProfileFeedTabContent = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const { ingredients, loading: isLoadingIngredients } = useAppSelector(
		(state) => state.ingredients
	);

	const { orders, gotFirstMessage } = useAppSelector(
		(state) => state.ordersUser
	);
	const ingredientsDict = useAppSelector(getIngredientsDict);

	useEffect(() => {
		dispatch(
			wsConnect(
				`${wsOrdersUserUrl}?token=${(localStorage.getItem('accessToken') as string).split('Bearer ')[1]}`
			)
		);

		return () => {
			dispatch(wsDisconnect());
		};
	}, [dispatch, ingredients]);

	if (!gotFirstMessage || isLoadingIngredients) {
		return (
			<div className={styles.preloaderWrap}>
				<Preloader />
			</div>
		);
	}

	return (
		<>
			{
				<div className='pr-2'>
					<FeedOrdersList
						orders={orders}
						ingredientsDict={ingredientsDict}
						linkpath='/profile/orders'
					/>
				</div>
			}
		</>
	);
};
