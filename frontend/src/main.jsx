import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import { PreferencesProvider } from './contexts/PreferencesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreferencesProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PreferencesProvider>
  </StrictMode>,
)
