import './assets/scss/main.scss'

import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import LoadingScreen from './shared/LoadingScreen'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/auth.context'
import { Provider } from 'react-redux'
import store from './services/store'

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<LoadingScreen />}>
    <Provider store={store}>
      <AuthProvider>
        <HashRouter>
          <App />
          <Toaster position='top-right' />
        </HashRouter>
      </AuthProvider>
    </Provider>
  </Suspense>
)
