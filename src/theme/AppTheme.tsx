import * as React from 'react';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import type {ThemeOptions} from '@mui/material/styles';
import theme from "./theme.ts";

interface AppTheme {
	children: React.ReactNode;
	disableCustomTheme?: boolean;
	themeComponents?: ThemeOptions['components'];
}

const AppTheme: React.FC<AppTheme> = ({children, disableCustomTheme, themeComponents}) => {
	const customTheme = React.useMemo(() => {
		return disableCustomTheme
		? createTheme()
			:
			theme(themeComponents)
	}, [disableCustomTheme, themeComponents])
	return (
		<ThemeProvider theme={customTheme} disableTransitionOnChange noSsr>
			{children}
		</ThemeProvider>
	);
}

export default AppTheme