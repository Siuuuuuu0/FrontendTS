

import React from 'react';


import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './app/store'
import { Provider } from 'react-redux'

import { ProfilePictureProvider } from './context/profilePictureContext';




// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const client = process.env.REACT_APP_GOOGLE_CLIENT_ID


// @ts-expect-error TS(2345): Argument of type 'HTMLElement | null' is not assig... Remove this comment to see the full error message
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(



  // @ts-expect-error TS(2746): This JSX tag's 'children' prop expects a single ch... Remove this comment to see the full error message
  <React.StrictMode>
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    // @ts-expect-error TS(2741): Property 'children' is missing in type '{ store: E... Remove this comment to see the full error message
    <Provider store={store}>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <ProfilePictureProvider>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <BrowserRouter>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          // @ts-expect-error TS(2552): Cannot find name 'clientId'. Did you mean 'client'... Remove this comment to see the full error message
          // @ts-expect-error TS(2552): Cannot find name 'clientId'. Did you mean 'client'... Remove this comment to see the full error message
          // @ts-expect-error TS(2741): Property 'children' is missing in type '{ clientId... Remove this comment to see the full error message
          <GoogleOAuthProvider clientId={client}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Routes>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              // @ts-expect-error TS(2786): 'App' cannot be used as a JSX component.
              // @ts-expect-error TS(2786): 'App' cannot be used as a JSX component.
              <Route path="/*" element={<App />} />
            </Routes>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </ProfilePictureProvider>
    </Provider>
  </React.StrictMode>
);
