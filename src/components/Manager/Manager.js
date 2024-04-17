import styles from './Manager.module.scss';


export const Manager = ({ manager }) => {
	return (
		<div className={styles.container}>
			<img className={styles.avatar} src={manager.avatar}></img>
			<div className={styles.info}>
				<span>{manager.name}</span>
				<span>{manager.surname}</span>
			</div>
		</div>
	);
}