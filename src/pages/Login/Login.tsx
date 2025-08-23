import React, { FormEvent, useState } from 'react';
import styles from './Login.module.css';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { login } from '@/services/auth';
import { useAppDispatch } from '@/services/store';
import { NavLink } from 'react-router-dom';
import { Preloader } from '@components/preloader/preloader';

export const Login = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [showPreloader, setShowPreloader] = useState(false);

	async function formSubmitHandler(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrorMsg('');
		setShowPreloader(true);
		try {
			await dispatch(login({ email, password })).unwrap();
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
					<h1 className='text text_type_main-medium mb-6'>Вход</h1>
					<form onSubmit={formSubmitHandler} className={styles.form}>
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
							name={'password'}
						/>
						<Button
							htmlType='submit'
							type='primary'
							disabled={!(email && password)}
							size='large'>
							Войти
						</Button>
					</form>
					<div className={styles.bottomTextWrap}>
						{errorMsg && (
							<p className='text text_type_main-default text_color_error mt-4'>
								{errorMsg}
							</p>
						)}
						<p className='text text_type_main-default text_color_inactive mt-20'>
							Вы — новый пользователь?{' '}
							<NavLink to='/register' className='text_color_accent td-none'>
								Зарегистрироваться
							</NavLink>
						</p>
						<p className='text text_type_main-default text_color_inactive '>
							Забыли пароль?{' '}
							<NavLink
								to='/forgot-password'
								className='text_color_accent td-none'>
								Восстановить пароль
							</NavLink>
						</p>
					</div>
				</div>
			)}
		</>
	);
};
