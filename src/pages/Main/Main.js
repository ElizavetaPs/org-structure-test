'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMount } from '@/utils/useMount';
import { User } from '@/components/User/User';
import { Form } from './Form/Form';
import { Popup } from './Popup/Popup';
import { Manager } from '@/components/Manager/Manager';
import { Lines } from '@/components/Lines/Lines';
import styles from './Main.module.scss';


const getRandomId = (min, max) => (
	Math.floor(Math.random() * (max - min) + min)
);

export const Main = () => {
	const isMount = useMount();
	const [users, setUsers] = useState([]);
	const [tree, setTree] = useState([]);
	const [isPopup, setPopup] = useState(false);
	const [isFormPopup, setIsFormPopup] = useState(false);
	const [focusedUser, setFocusedUser] = useState(null);
	const [selectedManager, setSelectedManager] = useState(null);
	const [availableManagers, setAvailableManagers] = useState([]);

	useEffect(() => {
		axios.get('/data.json').then(({ data }) => setUsers(data.users));
	}, []);

	useEffect(() => {
		generateTree(users);
	}, [users]);

	useEffect(() => {
		if (isMount && focusedUser) {
			changeManager();
		}
	}, [selectedManager]);

	const createUser = (newUser) => {
		newUser.id = getRandomId(10, 1000000);
		newUser.managerId = selectedManager?.id ?? null;
		setUsers(users => [...users, newUser]);
		closeFormPopup();
		setSelectedManager(null);
	}

	const appointAsManager = () => {
		const updatedUsers = users.map((user) => {
			if (user.id === focusedUser.id) {
				return { ...user, managerId: null }
			} else {
				return user;
			}
		});

		setFocusedUser(null);
		update(updatedUsers);
	}

	const changeManager = () => {
		const newManagerId = selectedManager?.id ?? null;

		const updatedUsers = users.map((user) => {
			if (user.id === focusedUser.id) {
				return { ...user, managerId: newManagerId }
			} else {
				return user;
			}
		});

		setFocusedUser(null);
		setSelectedManager(null);
		update(updatedUsers);
	}

	const selectManager = (manager) => {
		setSelectedManager(manager);
		closePopup();
	}

	const generateTree = (users) => {
		const tree = (items, id = null, link = 'managerId') =>
			items
				.filter(item => item[link] === id)
				.map(item => ({ ...item, children: tree(items, item.id) }));

		setTree(tree(users));
	}

	const renderTree = (tree) => {
		if (!tree.length) return;

		return (
			<ul className={styles.list}>
				{tree.map((node) => {
					const { managerId } = node;
					const manager = users.find((u) => u.id === managerId);
					return (
						<li className={styles.item} key={node.id}>
							<User
								user={node}
								manager={manager}
								isFocused={focusedUser?.id === node.id}
								onFocus={focusUser}
								onDelete={deleteUser}
								openPopup={openPopup}
								onAppointAsManager={appointAsManager}
							/>
							{renderTree(node.children)}
						</li>
					);
				})}
			</ul>
		);
	}

	const update = (users) => {
		setUsers(users);
	}

	const deleteUser = (id, manager) => {
		const managerId = manager?.id ?? null;
		const children = users.filter((c) => c.managerId === id);
		const updatedUsers = users.filter(item => item.id !== id);

		if (children.length) {
			children.forEach(({ id }) => {
				updatedUsers.find((user) => user.id === id).managerId = managerId;
			});
		}

		setFocusedUser(null);
		update(updatedUsers);
	}

	const focusUser = (user) => {
		setFocusedUser(user);
	}

	const generateAvailableManagers = () => {
		if (!focusedUser) {
			setAvailableManagers(users);
		} else {
			const children = [];

			const findChildren = (node) => {
				if (!node.children.length === 0) return;
				node.children.forEach(child => {
					children.push(child.id);
					findChildren(child);
				});
			}

			findChildren(focusedUser);

			setAvailableManagers(
				users
					.filter((u) => u.id !== focusedUser.id)
					.filter((u) => u.id !== focusedUser.managerId)
					.filter((u) => !children.includes(u.id))
			);
		}
	}

	const openPopup = () => {
		generateAvailableManagers();
		setPopup(true);
	}

	const selectManagerHandler = () => {
		setSelectedManager(null);
		setFocusedUser(null);
		openPopup();
	}

	const closePopup = () => {
		setPopup(false);
	}

	const openFormPopup = () => {
		setIsFormPopup(true);
	}

	const closeFormPopup = () => {
		setIsFormPopup(false);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<button className="button" onClick={openFormPopup}>Добавить пользователя</button>
			</div>
			{
				isFormPopup && (
					<Popup onClose={closeFormPopup}>
						<Form
							manager={selectedManager}
							selectManager={selectManager}
							createUser={createUser}
							openPopup={openPopup}
							onSelect={selectManagerHandler}
						/>
					</Popup>
				)
			}
			{
				isPopup && (
					<Popup onClose={closePopup}>
						{
							!!availableManagers.length ? (
								availableManagers.map((manager) => (
									<button onClick={() => selectManager(manager)} key={`manager-${manager.id}`}>
										<Manager manager={manager} />
									</button>
								))
							) : (
								<div>Нет доступных менеджеров</div>
							)
						}
					</Popup>
				)
			}
			<div className={styles.area}>{renderTree(tree)}</div>
			{/* <Lines /> */}
		</div>
	);
}