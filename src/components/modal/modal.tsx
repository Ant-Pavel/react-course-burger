import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { ModalOverlay } from '../modal-overlay/modal-overlay';

interface IModalProps {
	children: React.ReactNode;
	closeHandler: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export const Modal = ({
	children,
	closeHandler,
}: IModalProps): null | React.JSX.Element => {
	const handleOverlayKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.code === 'Escape') closeHandler();
	};
	const dialogContentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (dialogContentRef && dialogContentRef.current) {
			dialogContentRef.current.focus();
		}
	}, []);

	return createPortal(
		<ModalOverlay
			clickHandler={closeHandler}
			keyDownHandler={handleOverlayKeydown}>
			<div
				tabIndex={-1}
				ref={dialogContentRef}
				className={`${styles.modal__box} p-10`}
				onClick={(e) => e.stopPropagation()}>
				<CloseIcon
					type='primary'
					className={styles.modal__closeicon}
					onClick={closeHandler}
				/>
				{children}
			</div>
		</ModalOverlay>,
		modalRoot
	);
};
