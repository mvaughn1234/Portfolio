import {
	Divider,
	Fade,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	Radio,
	RadioGroup,
	Select, SelectChangeEvent,
	Slider
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid2';
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import {alpha, styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from "dayjs";
import React, {useState} from 'react'
import AirQualityAnalysisWrapper from "./charts/AirQualityAnalysis.tsx";
import EducationResultsWrapper from "./charts/EducationResults.tsx";

const StyledBox = styled('div')(({theme}) => ({
	alignSelf: 'center',
	width: '100%',
	marginTop: useMediaQuery(theme.breakpoints.up('sm')) ? theme.spacing(8) : theme.spacing(10),
	borderRadius: theme.shape.borderRadius,
	outline: '6px solid',
	outlineColor: theme.palette.brand ? alpha(theme.palette.brand[50], 0.2) : 'hsla(220, 25%, 80%, 0.2)',
	border: '1px solid',
	borderColor: theme.palette.grey[200],
	backgroundColor: theme.palette.background.paper,
	boxShadow: `0 0 12px 8px ${theme.palette.brand ? alpha(theme.palette.brand[200], 0.1) : 'hsla(220, 25%, 80%, 0.2)'}`,
	...theme.applyStyles('dark', {
		boxShadow: `0 0 24px 12px ${theme.palette.brand ? alpha(theme.palette.brand[600], 0.1) : 'hsla(210, 100%, 25%, 0.2)'}`,
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

const charts = ["Student Performance Metrics", "Air Quality Analysis"]

const GraphWrapper: React.FC<GraphWrapperProps> = ({selectedGraph, interactionProps}) => {
	if (selectedGraph === charts[0]) {
		return (
			<Stack direction="column" sx={{justifyContent: 'center', width: '100%', pt: 1, alignItems: 'center'}}>
				<Typography align='center'>Impact of Study and Sleep Habits on Academic Performance</Typography>
				<EducationResultsWrapper height={320}
																 xSwitch={(interactionProps !== null && interactionProps.length > 0 && (interactionProps[0] && interactionProps[0]["xSwitch"] as ("study_hours" | "sleep_hours"))) || "study_hours"}/>
			</Stack>
		)
	} else if (selectedGraph === charts[1]) {
		return (
			<Stack direction="column" sx={{justifyContent: 'center', width: '100%', pt: 1, alignItems: 'center'}}>
				<Typography align='center'>Air Quality Analysis</Typography>
				<AirQualityAnalysisWrapper height={320}
																	 date={(interactionProps !== null && interactionProps.length > 0 && interactionProps[0] && interactionProps[0]["date"]) ? interactionProps[0]["date"] : "2015"}
																	 metric={(interactionProps !== null && interactionProps.length > 0 && interactionProps[1] && interactionProps[1]["metric"]) ? interactionProps[1]["metric"] : "Nitrogen"}/>
			</Stack>
		)
	}
	return (<></>)
}

const InteractionsWrapper: React.FC<InteractionsWrapperProps> = ({selectedGraph, handleSetInteractionProps}) => {
	const minDate = dayjs('2005-01-01');
	const maxDate = dayjs('2022-11-30');
	const totalDays = maxDate.diff(minDate, 'day');
	const [xSwitch, setXSwitch] = useState<"sleep_hours" | "study_hours">("study_hours");
	const [aqDate, setAQDate] = useState<Dayjs>(dayjs('2015'));
	const [aqDateSlider, setAQDateSlider] = useState<number>(aqDate.diff(minDate, 'day'));
	const [aqSelector, setAQSelector] = useState<string>("Nitrogen dioxide (NO2)");
	const aqMetrics: Record<string, string> = {
		"Nitrogen dioxide (NO2)": "Nitrogen",
		"Fine particles (PM 2.5)": "Fine",
		"Boiler Emissions- Total SO2 Emissions": "Boiler",
	};

	const handleEducationSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setXSwitch(event.target.value as "study_hours" || "sleep_hours");
		handleSetInteractionProps([{"xSwitch": event.target.value}])
	}

	const handleAQDateSlider = (_event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setAQDateSlider(newValue);
			const newDate = minDate.add(newValue, 'day');
			setAQDate(newDate);
			handleSetInteractionProps([{"date": newDate.format('YYYY-MM-DD')}, {"metric": aqMetrics[aqSelector]}])
		}
	};

	const handleAQDate = (newValue: Dayjs | null) => {
		if (newValue) {
			setAQDate(newValue);
			const daysFromStart = newValue.diff(minDate, 'day');
			setAQDateSlider(daysFromStart);
			handleSetInteractionProps([{"date": newValue.format('YYYY-MM-DD')}, {"metric": aqMetrics[aqSelector]}])
		}
	};

	const handleAQSelector = (event: SelectChangeEvent) => {
		const newValue = event.target.value as string;
		setAQSelector(newValue);
		handleSetInteractionProps([
			{ date: aqDate.format("YYYY-MM-DD") },
			{ metric: aqMetrics[newValue] }
		]);
	};

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
					<FormControlLabel value="study_hours" control={<Radio/>} label="Study Hours"/>
					<FormControlLabel value="sleep_hours" control={<Radio/>} label="Sleep Hours"/>
				</RadioGroup>
			</FormControl>
		)
	} else if (selectedGraph === charts[1]) {
		return (
			<Stack direction="column" sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
				<FormControl sx={{mb: 1, width: '100%', maxWidth: 250}}>
					<InputLabel>Air Quality Metric</InputLabel>
					<Select
						label="Select Chart"
						value={aqSelector}
						onChange={handleAQSelector}
						variant="outlined"
					>
						{Object.keys(aqMetrics).map((metric) => (
							<MenuItem key={metric} value={metric}>{metric}</MenuItem>
						))}
					</Select>
				</FormControl>
				<Stack direction="row" spacing={2} sx={{width: '100%', alignItems: 'center'}}>
					<Slider
						// size="small"
						min={0}
						max={totalDays}
						value={aqDateSlider}
						onChange={handleAQDateSlider}
						aria-label="Date slider"
						valueLabelDisplay="auto"
						valueLabelFormat={(value) => minDate.add(value, 'day').format('YYYY-MM-DD')}
					/>
					<DatePicker
						label="Date"
						value={aqDate}
						minDate={minDate}
						maxDate={maxDate}
						onChange={handleAQDate}
						slotProps={{
							textField: {
								sx: {minWidth: {xs: 100, lg: 135}}
							}
						}}

					/>
				</Stack>
			</Stack>
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
		<Container sx={{pb: 10}}>
			<StyledBox id="chart playground">
				{selectedChart === ''
					?
					<Box sx={{
						display: 'flex',
						width: '100%',
						height: {xs: 200, sm: 300},
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Stack sx={{width: '100%', alignItems: 'center'}}>
							<Typography variant="h4">Pick A Chart...</Typography>
							{graphSelect}
						</Stack>
					</Box>
					:
					<Fade in={selectedChart !== ''} timeout={500}>
						<Box sx={{flexGrow: 1, height: '100%'}}>
							<Grid container spacing={2} alignItems="center" sx={{height: '100%'}}>
								<Grid size={{xs: 12, sm: 8, md: 8}} sx={{height: {sm: '100%'}, px: 2}}>
									<GraphWrapper selectedGraph={selectedChart} interactionProps={interactionProps}/>
								</Grid>
								<Grid size={{xs: 12, sm: 4, md: 4}}
											sx={{display: 'flex', height: {sm: '100%'}, alignItems: 'center', justifyContent: 'center'}}>
									<Stack spacing={2} sx={{alignItems: 'flex-start', justifyContent: 'center', p: 2}}>
										{graphSelect}
										<Divider/>
										<InteractionsWrapper
											selectedGraph={selectedChart}
											handleSetInteractionProps={handleSetInteractionProps}
										/>
									</Stack>
								</Grid>
							</Grid>
						</Box>
					</Fade>

				}
			</StyledBox>
		</Container>
	);
}

export default ChartPlayground