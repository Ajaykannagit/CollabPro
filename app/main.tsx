import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import '../index.css'

import ErrorBoundary from '@/components/ErrorBoundary';
import { seedDatabase } from '@/lib/seedDatabase';

// Initialize database with seed data
seedDatabase();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
