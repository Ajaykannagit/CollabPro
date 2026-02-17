import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import '../index.css'

import ErrorBoundary from '@/components/ErrorBoundary';
// User context removed in favor of Zustand

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
