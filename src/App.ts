import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'
import Register from './features/auth/Register'
import Welcome from './features/auth/Welcome'
import Dash from './components/Dash'
import ConfirmCode from './features/auth/ConfirmCode'
import ConfirmRegistration from './features/auth/ConfirmRegistration'
import CompleteRegister from './features/auth/CompleteRegistration'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import Account from './features/account/Account'
import Update from './features/account/Update'
import Reset from './features/auth/Reset'
import ConfirmReset from './features/auth/ConfirmReset'

function App() {
  useTitle('Auth Page')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="confirm-code" element={<ConfirmCode />} />
        <Route path="register" element={<Register />}/>
        <Route path = "confirm-register" element={<ConfirmRegistration/>}/>
        <Route path = "complete-register" element={<CompleteRegister/>}/>
        <Route path ="reset" element={<Reset/>}/>
        <Route path ="confirm-reset" element={<ConfirmReset/>}/>

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route path="dash" element={<Dash />}>
              <Route index element={<Welcome />} />
              <Route path="users">
                <Route index element={<UsersList />}/>
                <Route path=":id" element={<EditUser/>}/>
              </Route>
              <Route path="settings" element={<Account/>}/>
              <Route path="update-email" element={<Update/>}/>
              <Route path="update-password" element={<Update/>}/>
            </Route>{/* End Dash */}
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;
