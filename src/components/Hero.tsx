import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const Hero: React.FC = () => {
	return (
		<Box
			id="hero"
			sx={(theme) => (
				{
					width: '100%',
					backgroundRepeat: 'no-repeat',
					backgroundImage:
						`radial-gradient(ellipse 80% 50% at 50% -20%, ${theme.palette.brand ? theme.palette.brand["200"] : 'hsl(210, 100%, 90%)'}, transparent)`,
					...theme.applyStyles('dark', {
						backgroundImage:
							`radial-gradient(ellipse 80% 50% at 50% -20%, ${theme.palette.brand ? theme.palette.brand["800"] : 'hsl(210, 100%, 16%)'}, transparent)`,
					}),
				})}
		>
			<Container
				maxWidth="lg"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					pt: {xs: 6, sm: 12},
					pb: {xs: 8, sm: 12},
				}}
			>
				<Stack
					spacing={2}
					useFlexGap
					sx={{alignItems: 'center', width: {xs: '100%', sm: '70%'}}}
				>
					<Stack sx={{alignItems: 'center'}}>
						<Typography
							variant="h1"
							sx={{
								// display: 'flex',
								// flexDirection: { xs: 'column', sm: 'row' },
								// alignItems: 'center',
								fontSize: 'clamp(3rem, 10vw, 3.5rem)',
							}}
						>
							Data
						</Typography>
						<Typography
							component="span"
							variant="h1"
							sx={(theme) => ({
								fontSize: 'clamp(3rem, 10vw, 3.5rem)',
								color: 'primary.main',
								...theme.applyStyles('dark', {
									color: 'primary.light',
								}),
							})}
						>
							Visualized
						</Typography>
					</Stack>
					<Typography
						sx={{
							textAlign: 'center',
							color: 'text.secondary',
							width: {sm: '100%', md: '80%'},
						}}
					>
						I help clients transform complex data into actionable insights with intuitive, dynamic visualizations and
						scalable full-stack applications.
					</Typography>
				</Stack>
			</Container>
		</Box>
	);
}

export default Hero;