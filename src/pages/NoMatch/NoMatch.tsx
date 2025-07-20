import React from 'react';
import styles from './NoMatch.module.css';
import { NavLink } from 'react-router-dom';

export const NoMatch = (): React.JSX.Element => {
	return (
		<div className={styles.wrap}>
			<h1 className='text text_type_main-large'>Страница не найдена</h1>
			<p>
				{' '}
				<NavLink
					to='/'
					className='text_color_accent td-none text_type_main-small'>
					Вернуться на главную
				</NavLink>
			</p>
		</div>
	);
};
