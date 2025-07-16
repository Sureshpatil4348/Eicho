import { Route, Routes } from 'react-router-dom'
import { AuthGuard } from './guards'
import LoginPage from './pages/auth/login.page'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Routes>
      <Route path='/' element={<AuthGuard />}>
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
