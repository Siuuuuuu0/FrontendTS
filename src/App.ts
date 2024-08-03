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



    // @ts-expect-error TS(2749): 'Routes' refers to a value, but is being used as a... Remove this comment to see the full error message
    <Routes>



      // @ts-expect-error TS(2749): 'Route' refers to a value, but is being used as a ... Remove this comment to see the full error message
      <Route path="/" element={<Layout />}>
        {/* public routes */}



        // @ts-expect-error TS(2304): Cannot find name 'index'.
        <Route index element={<Public />} />



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path="login" element={<Login />} />



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path="confirm-code" element={<ConfirmCode />} />



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path="register" element={<Register />}/>



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path = "confirm-register" element={<ConfirmRegistration/>}/>



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path = "complete-register" element={<CompleteRegister/>}/>



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path ="reset" element={<Reset/>}/>



        // @ts-expect-error TS(2304): Cannot find name 'path'.
        <Route path ="confirm-reset" element={<ConfirmReset/>}/>

        {/* Protected Routes */}



        // @ts-expect-error TS(2749): 'Route' refers to a value, but is being used as a ... Remove this comment to see the full error message
        <Route element={<PersistLogin />}>



          // @ts-expect-error TS(2304): Cannot find name 'element'.
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>



            // @ts-expect-error TS(2749): 'Route' refers to a value, but is being used as a ... Remove this comment to see the full error message
            <Route path="dash" element={<Dash />}>



              // @ts-expect-error TS(2749): 'Route' refers to a value, but is being used as a ... Remove this comment to see the full error message
              <Route index element={<Welcome />} />



              // @ts-expect-error TS(2304): Cannot find name 'path'.
              <Route path="users">



                // @ts-expect-error TS(2749): 'Route' refers to a value, but is being used as a ... Remove this comment to see the full error message
                <Route index element={<UsersList />}/>



                // @ts-expect-error TS(2304): Cannot find name 'path'.
                <Route path=":id" element={<EditUser/>}/>
              </Route>



              // @ts-expect-error TS(2304): Cannot find name 'path'.
              <Route path="settings" element={<Account/>}/>



              // @ts-expect-error TS(2304): Cannot find name 'path'.
              <Route path="update-email" element={<Update/>}/>



              // @ts-expect-error TS(2304): Cannot find name 'path'.
              <Route path="update-password" element={<Update/>}/>



            // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
            </Route>{/* End Dash */}
          </Route>



        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;
