import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import AppRoutes from './routes/AppRoutes'

// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') {
//     return
//   }
//   const { worker } = await import('./test/mocks/browser')
//   return worker.start({ onUnhandledRequest: 'bypass' })
// }

// Force unregister any existing mock service workers to ensure we hit the real backend
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Unregistered dangling service worker:', registration);
    }
  });
}

// enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  )
// });
