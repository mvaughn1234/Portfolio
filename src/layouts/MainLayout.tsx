import {Box} from "@mui/material";
import React from 'react';
import AppAppBar from "../components/AppBar.tsx";

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto'}}>
			<AppAppBar/>
			{children}
		</Box>
	);
};

export default MainLayout;