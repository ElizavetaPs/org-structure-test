import { useState, useLayoutEffect, useEffect } from 'react';


export const useMount = () => {
	const [isMount, setIsMount] = useState(false);

	(typeof window !== 'undefined' ? useLayoutEffect : useEffect)(() => {
		setIsMount(true);
	}, []);

	return isMount;
};