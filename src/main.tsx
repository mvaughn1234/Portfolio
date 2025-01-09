import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import App from './App.tsx'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
