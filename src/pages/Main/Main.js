'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMount } from '@/utils/useMount';
import { CreateUserForm } from './CreateUserForm/CreateUserForm';
import { Popup } from '@/components/Popup/Popup';
import { UsersTree } from './UsersTree/UsersTree';
import { UsersList } from './UsersList/UsersList';
import styles from './Main.module.scss';


const generateRandomId = () => (
	new Date().valueOf()
);

export const Main = () => {
	const isMount = useMount();
	const [users, setUsers] = useState([]);
	const [tree, setTree] = useState([]);
	const [isPopup, setPopup] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
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

	const getUser = (id) => {
		return users.find((u) => u.id === id);
	}

	const createUser = (newUser) => {
		newUser.id = generateRandomId();
		newUser.managerId = selectedManager?.id ?? null;
		setUsers(users => [...users, newUser]);
		closeForm();
		setSelectedManager(null);
	}

	const setAsHead = () => {
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
		const tree = (items, id = null, link = 'managerId') => (
			items
				.filter(item => item[link] === id)
				.map(item => ({ ...item, children: tree(items, item.id) }))
		);

		setTree(tree(users));
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

	const closePopup = () => {
		setPopup(false);
	}

	const openForm = () => {
		setFocusedUser(null);
		setIsFormOpen(true);
	}

	const closeForm = () => {
		setIsFormOpen(false);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<button className="button" onClick={openForm}>Добавить пользователя</button>
			</div>
			{
				isFormOpen && (
					<Popup onClose={closeForm}>
						<CreateUserForm
							manager={selectedManager}
							onSelect={selectManager}
							openPopup={openPopup}
							createUser={createUser}
						/>
					</Popup>
				)
			}
			{
				isPopup && (
					<Popup onClose={closePopup}>
						{
							!!availableManagers.length ? (
								<UsersList users={availableManagers} onSelect={selectManager} />
							) : (
								<div>Нет доступных менеджеров</div>
							)
						}
					</Popup>
				)
			}
			<div className={styles.tree}>
				<UsersTree
					tree={tree}
					getUser={getUser}
					onDelete={deleteUser}
					onFocus={focusUser}
					setAsHead={setAsHead}
					openPopup={openPopup}
					focusedUser={focusedUser}
				/>
			</div>
		</div>
	);
}