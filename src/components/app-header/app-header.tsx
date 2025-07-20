import styles from './app-header.module.css';
import {
	BurgerIcon,
	ListIcon,
	ProfileIcon,
	Logo,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, matchRoutes, useLocation } from 'react-router-dom';

export const AppHeader = () => {
	const location = useLocation();
	const isActiveLink = (path: string) => {
		const routes = matchRoutes(
			[{ path, caseSensitive: false }],
			location.pathname
		);
		return routes !== null;
	};
	return (
		<header className={styles.header}>
			<nav className={`${styles.menu} p-4`}>
				<div className={styles.menu_part_left}>
					{/*пока тут должны быть ссылки, а не например кнопки или абзацы*/}
					<NavLink
						to='/'
						className={`${styles.link} ${isActiveLink('/') && styles.link_active}`}>
						<BurgerIcon type={isActiveLink('/') ? 'primary' : 'secondary'} />
						<p className='text text_type_main-default ml-2'>Конструктор</p>
					</NavLink>
					<NavLink to='/feed' className={`${styles.link} ml-10`}>
						<ListIcon type={isActiveLink('/feed') ? 'primary' : 'secondary'} />
						<p className='text text_type_main-default ml-2'>Лента заказов</p>
					</NavLink>
				</div>
				<div className={styles.logo}>
					<Logo />
				</div>
				<NavLink
					to='/profile'
					className={`${styles.link} ${styles.link_position_last} ${isActiveLink('/profile') && styles.link_active}`}>
					<ProfileIcon
						type={isActiveLink('/profile') ? 'primary' : 'secondary'}
					/>
					<p className='text text_type_main-default ml-2'>Личный кабинет</p>
				</NavLink>
			</nav>
		</header>
	);
};
