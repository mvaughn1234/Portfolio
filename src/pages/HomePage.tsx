import React from 'react';
import ChartPlayground from "../components/ChartPlayground.tsx";
import Hero from "../components/Hero.tsx";
import Project1 from "../components/Project1.tsx";

const HomePage: React.FC = () => {
	return (
		<>
			<Hero/>
			<ChartPlayground/>
			<div>
				<Project1 />
			</div>
		</>
	);
}

export default HomePage;