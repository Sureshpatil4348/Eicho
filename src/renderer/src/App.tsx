import { Route, Routes } from 'react-router-dom'
import { AuthGuard, DashboardGuard } from './guards'
import LoginPage from './pages/auth/login.page'
import HomePage from './pages/dashboard/home/home.page'
import PortfolioPage from './pages/dashboard/portfolio/portfolio.page'
import AccountPage from './pages/dashboard/account/account.page'
import ProfilePage from './pages/dashboard/account/profile.page'
import ChangePasswordPage from './pages/dashboard/account/change-password.page'
import Help from './pages/dashboard/account/help.page'
import DashboardLayout from './layouts/dashboard.layout'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Routes>
      <Route path='/' element={<AuthGuard />}>
        <Route index element={<LoginPage />} />
      </Route>

      <Route path='/dashboard' element={<DashboardGuard />}>
        <Route path='' element={<DashboardLayout />} >
          <Route index element={<HomePage />} />
          <Route path='portfolio' element={<PortfolioPage />} />
          <Route path='account' element={<AccountPage />} />
          <Route path='account/profile' element={<ProfilePage />} />
          <Route path='account/change-password' element={<ChangePasswordPage />} />
          <Route path='account/help' element={<Help />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
