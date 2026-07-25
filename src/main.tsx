import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#131a33', color: '#fff', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '12px', fontSize: '13px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#131a33' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#131a33' } },
        }}
      />
    </ErrorBoundary>
  </StrictMode>,
)
