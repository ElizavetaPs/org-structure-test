import { useEffect, useState } from 'react';
import axios from 'axios';
import { Manager } from '@/components/Manager/Manager';
import styles from './Form.module.scss';
import { default as loaderIcon } from '@/assets/icons/loader.svg';


export const Form = ({ createUser, manager, openPopup, selectManager, onSelect }) => {
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
							<img src={avatar} />
						)
					}
				</button>
				<div className={styles.inputs}>
					<input onChange={changeHandler} type="text" name="name" placeholder="Имя" />
					<input onChange={changeHandler} type="text" name="surname" placeholder="Фамилия" />
				</div>
			</div>
			{
				!!manager && <Manager manager={manager} />
			}
			<button className={styles.textButton} type="button" onClick={onSelect}>Выбрать руководителя</button>
			<button className="button" type="button" onClick={() => createUser(userData)}>Добавить пользователя</button>
		</form>
	);
}