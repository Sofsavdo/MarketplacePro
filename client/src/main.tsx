import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './simple-styles.css'
import { queryClient, defaultQueryFn } from '@/lib/queryClient'

// Set the default query function
queryClient.setDefaultOptions({
  queries: {
    queryFn: defaultQueryFn,
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)