import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './app/store'
import { Provider } from 'react-redux'

import { ProfilePictureProvider } from './context/profilePictureContext';

const client : string | undefined = process.env.REACT_APP_GOOGLE_CLIENT_ID

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(



  <React.StrictMode>
    <Provider store={store}>
      <ProfilePictureProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={client ?? ''}>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </ProfilePictureProvider>
    </Provider>
  </React.StrictMode>
);
