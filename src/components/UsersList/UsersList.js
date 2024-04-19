import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import styles from './UsersList.module.scss';


export const UsersList = ({ users, onSelect }) => {
	return (
		<ul className={styles.list}>
			{
				users.map((user) => (
					<li key={`manager-${user.id}`}>
						<button onClick={() => onSelect(user)}>
							<div className={styles.user}>
								<UserAvatar src={user.avatar} size={50} />
								<span>
									{user.name}
									&nbsp;
									{user.surname}
								</span>
							</div>
						</button>
					</li>
				))
			}
		</ul>
	);
}