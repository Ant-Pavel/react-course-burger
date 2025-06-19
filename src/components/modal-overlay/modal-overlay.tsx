import styles from './modal-overlay.module.css';

interface IModalOverlayProps {
	children: React.ReactNode;
	clickHandler: () => void;
	keyDownHandler: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const ModalOverlay = ({
	children,
	clickHandler,
	keyDownHandler,
}: IModalOverlayProps): React.JSX.Element => {
	return (
		<div
			className={styles.modal__overlaybase}
			onClick={clickHandler}
			onKeyDown={keyDownHandler}>
			<div className={styles.modal__overlay}>{children}</div>
		</div>
	);
};
