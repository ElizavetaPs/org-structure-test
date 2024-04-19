export const Line = ({ x1, y1, x2, y2 }) => {
	return (
		<svg width="100%" style={{ position: "absolute" }}>
			<line x1={x1} x2={x2} y1={y1} y2={y2} stroke="#a3a3a3" />
		</svg>
	);
}