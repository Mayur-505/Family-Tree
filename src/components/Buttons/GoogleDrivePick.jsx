import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import queryString from 'query-string';
import { style } from './Button';

const GoogleDrivePick = () => {
  const [oauthToken, setOauthToken] = useState(null);

  useEffect(() => {
    const { access_token } = queryString.parse(window.location.hash);

    if (access_token) {
      setOauthToken(access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      // Initialize the Google API client
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: 'AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg',
          clientId: '497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file',
        }).then(() => {
          // Check if the user is already signed in
          const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
          if (isSignedIn) {
            const currentUser = window.gapi.auth2.getAuthInstance().currentUser.get();
            setOauthToken(currentUser.get().getAuthResponse().access_token);
          }
        });
      });
    };
    document.head.appendChild(script);
  }, []);

  const handleSuccess = (data) => {
    console.log('Selected Files:', data);
  };

  const handleAuthClick = () => {
    // Ensure that gapi and gapi.auth2 are available
    if (window.gapi && window.gapi.auth2) {
      // Trigger the Google Sign-In dialog
      window.gapi.auth2.getAuthInstance().signIn().then((user) => {
        setOauthToken(user.getAuthResponse().access_token);
      });
    } else {
      console.error('Google API client library not fully loaded.');
    }
  };

  const openPicker = () => {
    if (!oauthToken || !window.gapi) {
      console.error('Authentication required. Please authenticate first or check Google API availability.');
      return;
    }

    window.gapi.load('picker', () => {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(oauthToken)
        .setDeveloperKey('AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg')
        .setCallback(handleSuccess)
        .build();

      picker.setVisible(true);
    });
  };

  const handleSignOut = () => {
    // Sign out the user
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signOut().then(() => {
        setOauthToken(null);
      });
    }
  };

  return (
    <div>
      {!oauthToken ? (
        <Button sx={style} component="label" onClick={handleAuthClick}>
          Authenticate with Google
        </Button>
      ) : (
        <>
          <Button sx={style} component="label" onClick={openPicker}>
            Open Google Picker
          </Button>
          <Button sx={style} component="label" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      )}
    </div>
  );
};

export default GoogleDrivePick;
