import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import '../index.css'

import ErrorBoundary from '@/components/ErrorBoundary';
import { UserProvider } from '@/contexts/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <UserProvider>
                <App />
            </UserProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
