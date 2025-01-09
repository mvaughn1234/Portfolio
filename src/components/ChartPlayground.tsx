import {
	Divider,
	Fade,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	Radio,
	RadioGroup,
	Select
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid2';
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import {alpha, styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, {useState} from 'react'
import EducationResultsWrapper from "./charts/EducationResults.tsx";

const StyledBox = styled('div')(({theme}) => ({
	alignSelf: 'center',
	width: '100%',
	height: useMediaQuery(theme.breakpoints.up('sm')) ? 400 : 600,
	marginTop: useMediaQuery(theme.breakpoints.up('sm')) ? theme.spacing(8) : theme.spacing(10),
	borderRadius: theme.shape.borderRadius,
	outline: '6px solid',
	outlineColor: theme.palette.brand ? alpha(theme.palette.brand[50], 0.2) : 'hsla(220, 25%, 80%, 0.2)',
	border: '1px solid',
	borderColor: theme.palette.grey[200],
	boxShadow: `0 0 12px 8px ${theme.palette.brand ? alpha(theme.palette.brand[200], 0.1) : 'hsla(220, 25%, 80%, 0.2)'}`,
	image: `url('https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
	backgroundSize: 'cover',
	// [theme.breakpoints.up('xs')]: {
	// 	marginTop: theme.spacing(10),
	// 	height: 700,
	// },
	...theme.applyStyles('dark', {
		boxShadow: `0 0 24px 12px ${theme.palette.brand ? alpha(theme.palette.brand[600], 0.1) : 'hsla(210, 100%, 25%, 0.2)'}`,
		backgroundImage: `url('https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
		// outlineColor: 'hsla(220, 20%, 42%, 0.1)',
		outlineColor: theme.palette.brand ? alpha(theme.palette.brand[900], 0.1) : 'hsla(220, 20%, 42%, 0.1)',
		borderColor: theme.palette.grey[700],
	}),
}));

interface GraphWrapperProps {
	selectedGraph: string;
	interactionProps: InteractionProp[] | null;
}

interface InteractionProp {
	[prop_name: string]: string;
}

interface InteractionsWrapperProps {
	selectedGraph: string;
	handleSetInteractionProps: (interactionsProps: InteractionProp[]) => void;
}

const charts = ["Student Performance Metrics"]

const GraphWrapper: React.FC<GraphWrapperProps> = ({selectedGraph, interactionProps}) => {
	if (selectedGraph === charts[0]) {
		return (
			<Stack direction="column" sx={{justifyContent: 'center', width: '100%', pt: 1, alignItems: 'center'}}>
				<Typography align='center'>Impact of Study and Sleep Habits on Academic Performance</Typography>
				<EducationResultsWrapper height={320}
																 xSwitch={(interactionProps !== null && interactionProps.length > 0 && (interactionProps[0]["xSwitch"] as "study_hours" || "sleep_hours")) || "study_hours"}/>
			</Stack>
		)
	}
	return (<></>)
}

const InteractionsWrapper: React.FC<InteractionsWrapperProps> = ({selectedGraph, handleSetInteractionProps}) => {
	const [xSwitch, setXSwitch] = useState<"sleep_hours" | "study_hours">("study_hours");

	const handleEducationSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setXSwitch(event.target.value as "study_hours" || "sleep_hours");
		handleSetInteractionProps([{"xSwitch": event.target.value}])
	}

	if (selectedGraph === charts[0]) {
		return (
			<FormControl>
				<FormLabel id="student-metrics-radio-buttons-group">Select Metric</FormLabel>
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					value={xSwitch}
					onChange={handleEducationSwitch}
				>
					<FormControlLabel value="study_hours" control={<Radio />} label="Study Hours"/>
					<FormControlLabel value="sleep_hours" control={<Radio />} label="Sleep Hours"/>
				</RadioGroup>
			</FormControl>
		)
	} else if (selectedGraph === charts[1]) {
		return (
			<></>
		)
	}
	return (<></>)
}

const ChartPlayground: React.FC = () => {
	const [interactionProps, setInteractionsProps] = useState<InteractionProp[] | null>(null);
	const [selectedChart, setSelectedChart] = useState<string>('')

	const handleSelectChart = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setSelectedChart(event.target.value)
	}

	const handleSetInteractionProps = (interactionsProps: InteractionProp[]) => {
		setInteractionsProps(interactionsProps);
	}
	const graphSelect = (
		<FormControl sx={{m: 1, width: '100%', maxWidth: 250}}>
			<InputLabel>Select Chart</InputLabel>
			<Select
				label="Select Chart"
				value={selectedChart}
				onChange={handleSelectChart}
				variant="outlined"
			>
				<MenuItem value={''}>None</MenuItem>
				{charts.map((chart) => (
					<MenuItem key={chart} value={chart}>{chart}</MenuItem>
				))}
			</Select>
		</FormControl>
	)

	return (
		<Container>
			<StyledBox id="image">
				{selectedChart === ''
					?
					<Box sx={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
						{graphSelect}
					</Box>
					:
					<Fade in={selectedChart !== ''} timeout={500}>
						{/* Everything that should be animated in goes here */}
						<Box sx={{flexGrow: 1, height: '100%'}}>
							<Grid container spacing={2} alignItems="center" sx={{height: '100%'}}>
								<Grid size={{xs: 12, sm: 8, md: 8}} sx={{height: {sm: '100%'}, px: 2}}>
									<GraphWrapper selectedGraph={selectedChart} interactionProps={interactionProps}/>
								</Grid>
								<Grid size={{xs: 12, sm: 4, md: 4}} sx={{display: 'flex', height: {sm: '100%'}, alignItems: 'center', justifyContent: 'center'}}>
									<Stack spacing={2} sx={{alignItems: 'flex-start', justifyContent: 'center', p: 2}}>
										{graphSelect}
										<Divider />
										<InteractionsWrapper
											selectedGraph={selectedChart}
											handleSetInteractionProps={handleSetInteractionProps}
										/>
									</Stack>
								</Grid>
							</Grid>
						</Box>
					</Fade>

				} {/* Render the Select when there is no chart */}
			</StyledBox>
		</Container>
	);
}

export default ChartPlayground