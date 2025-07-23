import React, { useState } from 'react';
import styles from './Register.module.css';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { register } from '@/services/auth';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/services/store';
import { NavLink } from 'react-router-dom';
import { Preloader } from '@components/preloader/preloader';

export const Register = (): React.JSX.Element => {
	const dispatch: AppDispatch = useDispatch();
	const [errorMsg, setErrorMsg] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPreloader, setShowPreloader] = useState(false);

	async function registerClickHandler() {
		setErrorMsg('');
		setShowPreloader(true);
		try {
			await dispatch(register({ name, email, password })).unwrap();
		} catch (error: unknown) {
			setErrorMsg(
				`Ошибка: ${Object.hasOwnProperty.call(error, 'message') ? (error as { message: string }).message : 'Неизвестная ошибка'}.`
			);
		} finally {
			setShowPreloader(false);
		}
	}

	return (
		<>
			{showPreloader ? (
				<Preloader />
			) : (
				<div className={styles.wrap}>
					<h1 className='text text_type_main-medium mb-6'>Регистрация</h1>
					<Input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Имя'
						extraClass='mb-6'
						name={'name'}
					/>
					<Input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='E-mail'
						extraClass='mb-6'
						name={'email'}
					/>
					<Input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Пароль'
						extraClass='mb-6'
						icon={'ShowIcon'}
						name={'password'}
					/>
					<Button
						disabled={!(name && email && password)}
						htmlType='button'
						type='primary'
						size='large'
						onClick={registerClickHandler}>
						Зарегистрироваться
					</Button>
					<div className={styles.bottomTextWrap}>
						{errorMsg && (
							<p className='text text_type_main-default text_color_error mt-4'>
								{errorMsg}
							</p>
						)}
						<p className='text text_type_main-default text_color_inactive mt-20'>
							Уже зарегистрированы?{' '}
							<NavLink to='/login' className='text_color_accent td-none'>
								Войти
							</NavLink>
						</p>
					</div>
				</div>
			)}
		</>
	);
};

/**
Pavel
artem.pavel2016@yandex.ru
Cheburashka
*/
