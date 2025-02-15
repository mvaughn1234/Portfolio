import React from 'react';
import ChartPlayground from "../components/ChartPlayground.tsx";
import Hero from "../components/Hero.tsx";
import Project1 from "../components/Project1.tsx";
import Project2 from "../components/Project2.tsx";

const HomePage: React.FC = () => {
	return (
		<>
			<Hero/>
			<ChartPlayground/>
			<div>
				<Project2 />
				<Project1 />
			</div>
		</>
	);
}

export default HomePage;