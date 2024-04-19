import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import styles from './CreateUserForm.module.scss';
import { default as loaderIcon } from '@/assets/icons/loader.svg';


export const CreateUserForm = ({ manager, createUser, onSelect, openPopup }) => {
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState({
		id: 100,
		name: 'Name',
		surname: 'Surname',
		managerId: null,
		avatar: '',
	});

	const generateAvatar = () => {
		if (isLoading) return;

		setIsLoading(true);
		axios.get('https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1')
			.then(({ data }) => {
				setAvatar(data[0].url);
				setIsLoading(false);
			});
	}

	const changeHandler = (e) => {
		const { target } = e;
		setUserData({
			...userData,
			[target.name]: target.value,
		});
	}

	useEffect(() => {
		generateAvatar();
	}, []);

	useEffect(() => {
		setUserData({
			...userData,
			avatar,
		});
	}, [avatar]);

	return (
		<form className={styles.form}>
			<div className={styles.container}>
				<button type="button" onClick={generateAvatar} className={styles.avatar}>
					{
						isLoading ? (
							<div className={styles.loader}>
								<img src={loaderIcon.src} />
							</div>
						) : (
							<UserAvatar src={avatar} size={90} />
						)
					}
				</button>
				<div className={styles.inputs}>
					<input onChange={changeHandler} type="text" name="name" placeholder="Имя" />
					<input onChange={changeHandler} type="text" name="surname" placeholder="Фамилия" />
				</div>
			</div>
			{
				!!manager && (
					<div className={styles.managerContainer}>
						<div className={styles.manager}>
							<UserAvatar src={manager.avatar} size={30} />
							<span>
								{manager.name}
								&nbsp;
								{manager.surname}
							</span>
						</div>
						<button className={styles.textButton} type="button" onClick={() => onSelect(null)}>
							Удалить
						</button>
					</div>
				)
			}
			<button className={styles.textButton} type="button" onClick={openPopup}>
				Выбрать руководителя
			</button>
			<button className="button" type="button" onClick={() => createUser(userData)}>
				Добавить пользователя
			</button>
		</form>
	);
}