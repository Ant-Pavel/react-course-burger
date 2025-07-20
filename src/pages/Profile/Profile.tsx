import React, { ChangeEvent, useState } from 'react';
import styles from './Profile.module.css';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { logout, getUser, updateUserData } from '@/services/auth';
import type { User } from '@/services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import type { AppDispatch } from '@/services/store';

export const Profile = (): React.JSX.Element => {
	const dispatch: AppDispatch = useDispatch();
	const {
		name: nameStore,
		email: emailStore,
		password: passwordStore,
	} = useSelector(getUser) as User;

	const [name, setName] = useState(nameStore);
	const [email, setEmail] = useState(emailStore);
	const [password, setPassword] = useState(passwordStore);
	const [showActionBtns, setShowActionsBtns] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const logOutClickHandler = async () => {
		await dispatch(logout());
	};

	const inputChangeHandler = (
		inputName: 'name' | 'email' | 'password',
		event: ChangeEvent
	) => {
		const value = (event.target as HTMLInputElement).value;
		let haveChanges = false;
		if (inputName === 'name') {
			setName(value);
			haveChanges = value !== nameStore;
		}
		if (inputName === 'email') {
			setEmail(value);
			haveChanges = value !== emailStore;
		}
		if (inputName === 'password') {
			setPassword(value);
			haveChanges = value !== passwordStore;
		}

		setShowActionsBtns(haveChanges);
	};

	const cancelChangesBtnHandler = () => {
		setName(nameStore);
		setEmail(emailStore);
		setPassword(passwordStore);
		setShowActionsBtns(false);
	};

	const saveChangesBtnHandler = async () => {
		setErrorMsg('');
		try {
			const dispatchRes = await dispatch(
				updateUserData({
					name,
					email,
					password,
				} as {
					name: string;
					email: string;
					password: string;
				})
			).unwrap();
			if (!dispatchRes.success && dispatchRes.message) {
				setErrorMsg(`Ошибка: ${dispatchRes.message}`);
			}
		} catch (error: unknown) {
			setErrorMsg(
				`Что-то пошло не так )=. ${Object.hasOwnProperty.call(error, 'message') ? (error as { message: string }).message : 'Неизвестная ошибка'}.`
			);
		}
	};

	return (
		<div className={styles.profileWrapper}>
			<div className={styles.profileLeftCol}>
				<ul className='profileNavList mb-20'>
					<li className='profileNavItem pt-4 pb-4'>
						<NavLink
							to='/profile'
							className='text text_type_main-medium text_color_primary td-none'>
							Профиль
						</NavLink>
					</li>
					<li className='profileNavItem pt-4 pb-4'>
						<NavLink
							to='/profile/orders'
							className='text text_type_main-medium text_color_inactive td-none'>
							История заказов
						</NavLink>
					</li>
					<li className='profileNavItem pt-4 pb-4'>
						<button
							onClick={logOutClickHandler}
							className={`${styles.exitBtn} text text_type_main-medium text_color_inactive td-none`}>
							Выход
						</button>
					</li>
				</ul>
				<p className='text text_type_main-small text_color_secondary pr-20'>
					В этом разделе вы можете изменить свои персональные данные
				</p>
			</div>
			<div>
				<Input
					type='text'
					value={name}
					placeholder='Имя'
					extraClass='mb-6 text_color_inactive'
					name={'name'}
					onChange={(e) => inputChangeHandler('name', e)}
				/>
				<Input
					type='email'
					value={email}
					onChange={(e) => inputChangeHandler('email', e)}
					placeholder='E-mail'
					extraClass='mb-6'
					name={'email'}
				/>
				<Input
					type='password'
					value={password ?? ''}
					onChange={(e) => inputChangeHandler('password', e)}
					placeholder='Пароль'
					extraClass='mb-6'
					name={'password'}
				/>
				{errorMsg && (
					<p className='text text_type_main-default text_color_error mb-4'>
						{errorMsg}
					</p>
				)}
				{showActionBtns && (
					<div className={styles.profileActionBtns}>
						<Button
							onClick={cancelChangesBtnHandler}
							htmlType='button'
							type='secondary'
							size='medium'
							extraClass='ml-2'>
							Отмена
						</Button>
						<Button
							disabled={!(name && email && password)}
							onClick={saveChangesBtnHandler}
							htmlType='button'
							type='primary'
							size='medium'
							extraClass='ml-2'>
							Сохранить
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
