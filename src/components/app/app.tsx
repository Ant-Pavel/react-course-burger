import React, { useEffect } from 'react';
import styles from './app.module.css';
import { AppHeader } from '@components/app-header/app-header.tsx';
import { useAppDispatch } from '@/services/store';
import { checkIfUserAuthed } from '@/services/auth';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home } from '@/pages/Home/Home';
import { Modal } from '@/components/modal/modal';
import { Login } from '@/pages/Login/Login';
import { Register } from '@/pages/Register/Register';
import { ForgotPassword } from '@/pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword/ResetPassword';
import { Profile } from '@/pages/Profile/Profile';
import { NoMatch } from '@/pages/NoMatch/NoMatch';
import { Ingredient } from '@/pages/Ingredient/Ingredient';
import { IngredientModalContent } from '@/components/ingredient-modal-content/ingredient-modal-content';
import { FeedPage } from '@/pages/FeedPage/FeedPage';
import { OrderInfo } from '@/components/order-info/order-info';
import { ProfileFeedTabContent } from '../profile-feed-tab-content/profile-feed-tab-content';
import { ProfileFormTabContent } from '../profile-form-tab-content/profile-form-tab-content';
import {
	OnlyAuthed,
	OnlyUnauthed,
} from '@/components/protected-route/protected-route';
import { fetchIngredients } from '@/services/ingredients';

export const App = (): React.JSX.Element => {
	const location = useLocation();
	console.log('location ', location);
	const navigate = useNavigate();
	const background: null | Location =
		location.state && location.state.background;
	const dispatch = useAppDispatch();
	dispatch(checkIfUserAuthed());
	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	const handleModalClose = () => {
		// Возвращаемся к предыдущему пути при закрытии модалки
		navigate(-1);
	};

	return (
		<div className={styles.app}>
			<>
				<AppHeader />
				<Routes location={background || location}>
					<Route index path='/' element={<Home />}></Route>
					<Route element={<FeedPage />} path='/feed'></Route>
					<Route element={<OrderInfo />} path='/feed/:number'></Route>
					<Route
						element={<Ingredient />}
						path='/ingredient/:ingredientId'></Route>
					<Route
						element={<OnlyUnauthed component={<Login />} />}
						path='/login'></Route>
					<Route
						element={<OnlyUnauthed component={<Register />} />}
						path='/register'></Route>
					<Route
						element={<OnlyUnauthed component={<ForgotPassword />} />}
						path='/forgot-password'></Route>
					<Route
						element={<OnlyUnauthed component={<ResetPassword />} />}
						path='/reset-password'></Route>
					<Route
						element={<OnlyAuthed component={<Profile />} />}
						path='/profile'>
						<Route element={<ProfileFormTabContent />} path='/profile' />
						<Route element={<ProfileFeedTabContent />} path='/profile/orders' />
					</Route>
					<Route
						element={<OnlyAuthed component={<OrderInfo />} />}
						path='/profile/orders/:number'></Route>
					<Route
						element={<OnlyAuthed component={<NoMatch />} />}
						path='*'></Route>
				</Routes>

				{background && (
					<Routes>
						<Route
							path='/ingredient/:ingredientId'
							element={
								<Modal closeHandler={handleModalClose}>
									<IngredientModalContent />
								</Modal>
							}
						/>
						<Route
							path='/feed/:number'
							element={
								<Modal closeHandler={handleModalClose}>
									<OrderInfo insideModal={true} />
								</Modal>
							}
						/>
						<Route
							path='/profile/orders/:number'
							element={
								<Modal closeHandler={handleModalClose}>
									<OrderInfo insideModal={true} />
								</Modal>
							}
						/>
					</Routes>
				)}
			</>
		</div>
	);
};
