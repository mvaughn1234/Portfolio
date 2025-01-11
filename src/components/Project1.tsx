import {Button, Divider} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {alpha, styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from 'react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const StyledBox = styled('div')(({theme}) => ({
	justifySelf: 'center',
	alignSelf: 'center',
	width: '80%',
	marginTop: useMediaQuery(theme.breakpoints.up('sm')) ? theme.spacing(8) : theme.spacing(10),
	borderRadius: theme.shape.borderRadius,
	outline: '6px solid',
	outlineColor: theme.palette.brand ? alpha(theme.palette.brand[50], 0.2) : 'hsla(220, 25%, 80%, 0.2)',
	border: '1px solid',
	borderColor: theme.palette.grey[200],
	backgroundColor: theme.palette.background.paper,
	backgroundImage: 'url(./assets/images/Project1Feature.png)',
	backgroundSize: 'cover',
	boxShadow: `0 0 12px 8px ${theme.palette.brand ? alpha(theme.palette.brand[200], 0.1) : 'hsla(220, 25%, 80%, 0.2)'}`,
	...theme.applyStyles('dark', {
		boxShadow: `0 0 24px 12px ${theme.palette.brand ? alpha(theme.palette.brand[600], 0.1) : 'hsla(210, 100%, 25%, 0.2)'}`,
		outlineColor: theme.palette.brand ? alpha(theme.palette.brand[900], 0.1) : 'hsla(220, 20%, 42%, 0.1)',
		borderColor: theme.palette.grey[700],
	}),
}));

const Project1: React.FC = () => {
	return (
		// <Box sx={(theme) => ({p: 10, width: '100%', backgroundColor: theme.palette.background.paper})}>
		<Box sx={{p: 10, width: '100%'}}>
			<Divider />
			<Stack spacing={4} sx={{
				alignItems: 'flex-start',
				justifyContent: 'flex-start',
				p: 4
			}}>
				<Stack spacing={1}>
					<Typography variant="h2" sx={(theme) => ({color: theme.palette.grey[700], ...theme.applyStyles('dark', {
						color: theme.palette.grey[50]
						})})}>Satisfactory Calculator</Typography>
					<Typography sx={{maxWidth: 500}} variant="body1">The app is designed optimize production lines in the game
						Satisfactory, helping players minimize resource usage, and maximize efficiency.
					</Typography>
				</Stack>
				<Button variant="contained" endIcon={<KeyboardDoubleArrowRightIcon/>} href="https://satisfactory-calc.netlify.app">
					Check it out
				</Button>
				<StyledBox sx={{height: 500}}/>
			</Stack>
		</Box>
	)
}

export default Project1