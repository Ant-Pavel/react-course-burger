import React from 'react';
import styles from './order-details.module.css';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';

export const OrderDetails = (): React.JSX.Element => {
	return (
		<div className={`${styles.order} pt-20`}>
			<p className={`${styles.order__id}  mb-8 text text_type_digits-large`}>
				123456
			</p>
			<p className='mb-15 text text_type_main-medium'>идентификатор заказа</p>
			<div className='mb-15'>
				<div className={`${styles.order__tickiconwrap}`}>
					<CheckMarkIcon
						className={`${styles.order__tickicon} text text_type_main-medium`}
						type='primary'
					/>
				</div>
			</div>
			<p className='mb-2 text text_type_main-default'>
				Ваш заказ начали готовить
			</p>
			<p className='text text_type_main-default text_color_inactive'>
				Дождитесь готовности на орбитальной станции
			</p>
		</div>
	);
};
