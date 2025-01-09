import React from 'react';
import ChartPlayground from "../components/ChartPlayground.tsx";
import Hero from "../components/Hero.tsx";

const HomePage: React.FC = () => {
	return (
		<>
			<Hero/>
			<ChartPlayground/>
		</>
	);
}

export default HomePage;