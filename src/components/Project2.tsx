import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SpeedIcon from "@mui/icons-material/Speed";
import {Button, Card, CardContent, CardHeader, Container, Dialog, Divider, Fade, IconButton} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";

const Project2: React.FC = () => {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<Container maxWidth="xl">
			<Box sx={{py: 10, px: {xs: 1, sm: 5, lg: 10, xl: 20}, width: "100%"}}>
				<Divider/>
				<Stack
					spacing={4}
					sx={{
						alignItems: "flex-start",
						justifyContent: "flex-start",
						p: {xs: 2, sm: 4},
					}}
				>
					<Typography
						variant="h2"
						sx={(theme) => ({
							color: theme.palette.grey[700],
							...theme.applyStyles("dark", {
								color: theme.palette.grey[50],
							}),
						})}
					>
						Business Dashboard
					</Typography>
					<Typography variant="body1" sx={{mb: 4, lineHeight: 1.6}}>
						This is an example of a custom dashboards for businesses to visualize and analyze their sales
						data, and manage their team and operations. With BusinessDash, you get
						interactive, web-based dashboards tailored to your needs—no
						subscriptions, no bloat, just results.
					</Typography>

					<Grid container spacing={4} sx={{px: {sm: 2, md: 6}}}>
						<Grid size={{xs: 12, sm: 6}}>
							<Stack direction="row" sx={{height: "100%"}}>
								<Box>
									<Typography variant="h5" component="h2" sx={{mb: 2}}>
										Key Features
									</Typography>
									<ul style={{paddingLeft: 20, marginBottom: 24}}>
										<li>
											<Typography variant="body1" sx={{py: 2}}>
												<strong>Real-Time Analytics:</strong> Track KPIs, monitor
												performance, and visualize trends effortlessly.
											</Typography>
										</li>
										<li>
											<Typography variant="body1" sx={{py: 2}}>
												<strong>Fully Customizable:</strong> Tailored to your business
												needs, whether it's sales analytics, client tracking, team
												management, internal reporting.
											</Typography>
										</li>
										<li>
											<Typography variant="body1" sx={{py: 2}}>
												<strong>Multi-Role Use:</strong> Whether you need
												Admin-Tools, Employee Utilities, or even a fully designed
												client-facing website to go with your dashboard. You'll find
												it here, all on the same site, authenticated, and secure.
											</Typography>
										</li>
									</ul>
								</Box>
								<Divider sx={{p: 2, display: {xs: "none", sm: "block"}}} orientation="vertical" variant="fullWidth"/>
							</Stack>
						</Grid>
						<Grid size={{xs: 12, sm: 6}} sx={{display: "flex", alignItems: "center"}}>
							<Box sx={{width: "100%", cursor: "pointer"}} onClick={handleOpenDialog}>
								<img
									width={"100%"}
									// height={`calc(100% / 1.5555)`}
									src={"/assets/images/Trainer-Sales-Tracking Highlight.png"}
									alt={"user-management-dashboard"}
									style={{borderRadius: 8}}
								/>
							</Box>
						</Grid>
					</Grid>

					<Typography variant="h5" component="h2" sx={{mb: 2}}>
						Highlights
					</Typography>

					<Grid container spacing={3} sx={{mb: 4}}>

						{/* Data Insights */}
						<Grid size={{xs: 12, sm: 4}}>
							<Card variant="outlined" sx={{height: "100%"}}>
								<CardHeader
									avatar={<BarChartIcon color="primary"/>}
									title={<Typography variant="h6">Data Insights</Typography>}
								/>
								<CardContent>
									<Typography variant="body2">
										Uncover hidden trends and patterns that empower strategic decision-making.
									</Typography>
								</CardContent>
							</Card>
						</Grid>

						{/* User-Centric Design */}
						<Grid size={{xs: 12, sm: 4}}>
							<Card variant="outlined" sx={{height: "100%"}}>
								<CardHeader
									avatar={<DesignServicesIcon color="secondary"/>}
									title={<Typography variant="h6">User-Centric Design</Typography>}
								/>
								<CardContent>
									<Typography variant="body2">
										Navigate effortlessly through an interface built for clarity and efficiency.
									</Typography>
								</CardContent>
							</Card>
						</Grid>

						{/* Performance Metrics */}
						<Grid size={{xs: 12, sm: 4}}>
							<Card variant="outlined" sx={{height: "100%"}}>
								<CardHeader
									avatar={<SpeedIcon color="success"/>}
									title={<Typography variant="h6">Performance Metrics</Typography>}
								/>
								<CardContent>
									<Typography variant="body2">
										Monitor key performance indicators in real time to keep your business agile.
									</Typography>
								</CardContent>
							</Card>
						</Grid>

					</Grid>

					<Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							endIcon={<KeyboardDoubleArrowRightIcon/>}
							sx={{textTransform: "none"}}
							href={"https://business-dash.netlify.app/"}
						>
							Discover More
						</Button>
					</Box>
				</Stack>

				{/* Fullscreen Dialog with Fade Transition */}
				<Dialog
					open={openDialog}
					onClose={handleCloseDialog}
					fullScreen
					TransitionComponent={Fade}
				>
					{/* Clickable Background */}
					<Box
						sx={{
							width: "100%",
							height: "100vh",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "rgba(0, 0, 0, 0.8)",
							position: "relative",
							cursor: "pointer",
						}}
						onClick={handleCloseDialog} // Closes when clicking anywhere outside the image
					>
						{/* Close Button in Top Right Corner */}
						<IconButton
							sx={{
								position: "absolute",
								top: 20,
								right: 20,
								color: "white",
								backgroundColor: "rgba(0, 0, 0, 0.5)",
								"&:hover": {backgroundColor: "rgba(0, 0, 0, 0.8)"},
							}}
							onClick={handleCloseDialog}
						>
							<CloseIcon/>
						</IconButton>

						{/* Image (Stops Click Propagation) */}
						<img
							src={"/assets/images/Trainer-Sales-Tracking Highlight.png"}
							alt={"Expanded View"}
							style={{width: "90%", maxHeight: "90vh", objectFit: "contain", borderRadius: 8}}
							onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image itself
						/>
					</Box>
				</Dialog>
			</Box>
		</Container>
	);
};

export default Project2;
