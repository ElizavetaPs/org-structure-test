import styles from './Popup.module.scss';


export const Popup = ({ children, onClose }) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.bg} onClick={onClose}></div>
			<div className={styles.container}>
				<button className={styles.close} onClick={onClose}>✖️</button>
				<div className={styles.body}>
					{children}
				</div>
			</div>
		</div>
	);
}