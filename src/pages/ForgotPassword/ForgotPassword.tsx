import React, { FormEvent, useState } from 'react';
import styles from './ForgotPassword.module.css';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/utils/authApi';
import { Preloader } from '@components/preloader/preloader';

export const ForgotPassword = (): React.JSX.Element => {
	const navigate = useNavigate();
	const [email, setEmail] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');
	const [showPreloader, setShowPreloader] = useState<boolean>(false);

	const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setShowPreloader(true);
		try {
			await resetPassword({ email });
			navigate('/reset-password');
		} catch (error) {
			setErrorMsg(
				`Ошибка: ${Object.hasOwnProperty.call(error, 'message') ? (error as { message: string }).message : 'Неизвестная ошибка'}.`
			);
		} finally {
			setShowPreloader(false);
		}
	};

	return (
		<>
			{showPreloader ? (
				<Preloader />
			) : (
				<div className={styles.wrap}>
					<h1 className='text text_type_main-medium mb-6'>
						Восстановление пароля
					</h1>
					<form onSubmit={formSubmitHandler} className={styles.form}>
						<Input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Укажите e-mail'
							extraClass='mb-6'
							name={'email'}
						/>
						<Button
							disabled={!email}
							htmlType='submit'
							type='primary'
							size='large'>
							Восстановить
						</Button>
					</form>
					<div className={styles.bottomTextWrap}>
						{errorMsg && (
							<p className='text text_type_main-default text_color_error mt-4'>
								{errorMsg}
							</p>
						)}
						<p className='text text_type_main-default text_color_inactive mt-20'>
							Вспомнили пароль?{' '}
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
