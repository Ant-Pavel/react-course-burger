import React from 'react';
import styles from './burger-constructor-empty-zone.module.css';

interface IBurgerConstructorEmptyZoneProps {
	type?: 'top' | 'bottom';
	children?: React.ReactNode;
	droppable?: boolean;
}

export const BurgerConstructorEmptyZone = ({
	type,
	children,
	droppable,
}: IBurgerConstructorEmptyZoneProps): React.JSX.Element => {
	return (
		<div
			className={`${styles.container}
			${type === 'top' ? styles.containerTop : ''}
			${type === 'bottom' ? styles.containerBottom : ''}
			${droppable ? styles.containerDroppable : ''}`}>
			<span className={styles.content}>{children}</span>
		</div>
	);
};
