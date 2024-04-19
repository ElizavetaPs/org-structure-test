import { useEffect, useState, useRef } from 'react';
import { Line } from '@/components/Line/Line';
import styles from './Node.module.scss';


export const Node = ({ children, parentRect }) => {
	const ref = useRef(null);
	const [rect, setRect] = useState(null);

	useEffect(() => {
		setRect(ref.current.getBoundingClientRect());
	}, [parentRect]);

	return (
		<>
			{
				!!parentRect && !!rect && (
					<Line
						x1={parentRect.width / 2}
						x2={rect.x - parentRect.x + rect.width / 2}
						y1={0}
						y2={parentRect.height}
					/>
				)
			}
			<div className={styles.container} ref={ref}>
				{children}
			</div>
		</>
	);
}