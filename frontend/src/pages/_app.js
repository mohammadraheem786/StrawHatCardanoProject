import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#ECFDF5',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FEF2F2',
              },
            },
          }}
        />
      </QueryClientProvider>
    </>
  )
}