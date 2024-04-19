import styles from './UserAvatar.module.scss';


export const UserAvatar = ({ size = 40, src }) => {
	return (
		<img
			className={styles.avatar}
			width={`${size}px`}
			height={size}
			src={src}
		/>
	);
}