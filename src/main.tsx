import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import ReactDOM from 'react-dom/client';
import App from './App.tsx'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<LocalizationProvider dateAdapter={AdapterDayjs}>
		<App/>
	</LocalizationProvider>
)
