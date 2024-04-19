import { useEffect, useState, useRef } from 'react';
import { Node } from './Node/Node';
import { User } from '@/components/User/User';
import styles from './UsersTree.module.scss';


export const UsersTree = ({ tree, getUser, depth = 0, ...props }) => {
	const ref = useRef(null);
	const [rect, setRect] = useState(null);

	useEffect(() => {
		if (depth) {
			setRect(ref.current.getBoundingClientRect());
		}
	}, [tree]);

	return (
		<div className={styles.list}>
			{
				!!depth && <div className={styles.space} ref={ref} />
			}
			{tree.map((user) => {
				const { managerId } = user;
				const manager = getUser(managerId);
				return (
					<Node key={user.id} parentRect={rect}>
						<User
							user={user}
							manager={manager}
							{...props}
						/>
						{
							!!user.children.length && (
								<UsersTree
									tree={user.children}
									getUser={getUser}
									depth={depth + 1}
									{...props}
								/>
							)
						}
					</Node>
				);
			})}
		</div>
	);
}