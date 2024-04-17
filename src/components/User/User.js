'use client';

import styles from './User.module.scss';


export const User = ({ user, manager, isFocused, onFocus, onDelete, openPopup, onAppointAsManager }) => {
	const focusHandler = (user) => {
		if (isFocused) {
			onFocus(null);
		} else {
			onFocus(user);
		}
	}

	return (
		<div className={styles.container}>
			<img className={styles.avatar} src={user.avatar}></img>
			<button onClick={() => focusHandler(user)} className={styles.button}>
				{isFocused ? "✖️" : "✎"}
			</button>
			<div className={styles.info}>
				<div>{user.name}</div>
				<div>{user.surname}</div>
				{
					!!manager ? (
						<div className={styles.manager}>Manager: {manager.name}</div>
					) : (
						<div className={styles.manager}>Head ⭐</div>
					)
				}
			</div>
			{
				isFocused && (
					<div className={styles.menu}>
						<button className={styles.menuItem} onClick={() => { onDelete(user.id, manager) }}>Удалить</button>
						<button className={styles.menuItem} onClick={openPopup}>Изменить руководителя</button>
						{
							!!manager && <button className={styles.menuItem} onClick={onAppointAsManager}>Назначить руководителем</button>
						}
					</div>
				)
			}
		</div>
	);
}