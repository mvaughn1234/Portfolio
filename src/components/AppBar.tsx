import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from "@mui/material/Link";
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import * as React from 'react';
import ColorModeIconDropdown from "../theme/ColorModeIconDropdown.tsx";

const AppAppBar: React.FC = () => {
	return (
		<>
			<AppBar
				position="fixed"
				color="transparent"
				sx={{
					boxShadow: 0,
					bgcolor: 'transparent',
					zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above content
				}}
			>
				<Container maxWidth="lg">
					<Toolbar variant="dense" disableGutters>
						<Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
							<Link href="#" underline="none" color="inherit">
								<Typography variant="h2" sx={{fontFamily: 'Major Mono Display'}}>MV</Typography>
							</Link>
							<Box sx={{pr: 1}}>
								<ColorModeIconDropdown/>
							</Box>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Spacer to push content below AppBar */}
			<Box sx={{ height: '48px' }} />
		</>
	);
}

export default AppAppBar;
