import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import {
	Input,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { resetPasswordVerification } from '@/utils/authApi';

export const ResetPassword = (): React.JSX.Element => {
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const verifyPasswordResetBtnClick = async () => {
		try {
			const res = await resetPasswordVerification({ password, token: code });
			if (res.success) navigate('/login');
			if (!res.success && res.message) {
				setErrorMsg(`Ошибка: ${res.message}`);
			}
		} catch (error) {
			setErrorMsg(
				`Что-то пошло не так )=. ${Object.hasOwnProperty.call(error, 'message') ? (error as { message: string }).message : 'Неизвестная ошибка'}.`
			);
		}
	};

	return (
		<div className={styles.wrap}>
			<h1 className='text text_type_main-medium mb-6'>Восстановление пароля</h1>
			<Input
				type='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder='Введите новый пароль'
				extraClass='mb-6'
				icon={'ShowIcon'}
				name={'password'}
			/>
			<Input
				type='text'
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder='Введите код из письма'
				extraClass='mb-6'
				name={'name'}
			/>
			<Button
				onClick={verifyPasswordResetBtnClick}
				htmlType='button'
				type='primary'
				size='large'>
				Сохранить
			</Button>
			<div className={styles.bottomTextWrap}>
				{errorMsg && (
					<p className='text text_type_main-default text_color_error mt-4'>
						{errorMsg}
					</p>
				)}
				<p className='text text_type_main-default text_color_inactive mt-20'>
					Вспомнили пароль?{' '}
					<NavLink to='/forgot-password' className='text_color_accent td-none'>
						Войти
					</NavLink>
				</p>
			</div>
		</div>
	);
};
