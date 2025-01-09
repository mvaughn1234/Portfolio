import {CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import AppTheme from "./theme/AppTheme.tsx";

const App: React.FC = () => {
	return (
		<AppTheme disableCustomTheme={false}>
			<>
				<CssBaseline/>
				<Box
					component="main"
					sx={
						(theme) => (
						{
							display: 'flex',
							flexDirection: 'column',
							height: '100vh',
							backgroundColor: theme.palette.background.default,
							overflow: 'hidden',
						}
						)
					}
				>

					<Router>
						<MainLayout>
							<Routes>
								<Route path="/" element={<HomePage />} />
							</Routes>
						</MainLayout>
					</Router>
				</Box>
			</>
		</AppTheme>
	)
}

export default App;