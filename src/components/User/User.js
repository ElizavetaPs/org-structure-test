'use client';

import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import styles from './User.module.scss';


export const User = ({ user, manager, focusedUser, onDelete, onFocus, setAsHead, openPopup }) => {
	const isFocused = focusedUser?.id === user.id;

	const focusHandler = (user) => {
		if (isFocused) {
			onFocus(null);
		} else {
			onFocus(user);
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.avatar}>
				<UserAvatar size={50} src={user.avatar} />
			</div>
			<button onClick={() => focusHandler(user)} className={styles.button}>
				{isFocused ? "✖️" : "✎"}
			</button>
			<div>
				<div>
					{user.name}
					<br />
					{user.surname}
				</div>
				<div className={styles.manager}>
					{
						!!manager
							? <>Manager: {manager.name}</>
							: <>Head ⭐</>
					}
				</div>
			</div>
			{
				isFocused && (
					<div className={styles.menu}>
						<button className={styles.menuItem} onClick={() => { onDelete(user.id, manager) }}>
							Удалить
						</button>
						<button className={styles.menuItem} onClick={openPopup}>
							Изменить руководителя
						</button>
						{
							!!manager && (
								<button className={styles.menuItem} onClick={setAsHead}>
									Назначить руководителем
								</button>
							)
						}
					</div>
				)
			}
		</div>
	);
}