import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { ModalOverlay } from '../modal-overlay/modal-overlay';

interface IModalProps {
	children: React.ReactNode;
	isOpen: boolean;
	closeHandler: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export const Modal = ({
	children,
	isOpen,
	closeHandler,
}: IModalProps): null | React.JSX.Element => {
	const handleOverlayKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.code === 'Escape') closeHandler();
	};
	const dialogContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && dialogContentRef && dialogContentRef.current) {
			dialogContentRef.current.focus();
		}
	}, [isOpen]);

	if (!isOpen) return null;

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
