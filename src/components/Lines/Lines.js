import { useEffect, useRef } from 'react';


export const Lines = () => {
	const ref = useRef(null);

	useEffect(() => {
		const canvas = ref.current;

		// canvas.width = window.innerWidth;
		// canvas.height = window.innerHeight;

		canvas.width = '100%';
		canvas.height = '100%';
	}, []);

	return <canvas style={{ position: 'absolute', top: 0, left: 0 }} ref={ref} />
}