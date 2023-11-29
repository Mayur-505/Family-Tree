import React, { useState, useEffect } from 'react';
import GooglePicker from 'react-google-picker';
import queryString from 'query-string';
import { Button } from '@mui/material';
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
      window.gapi.load('picker');
    };
    document.head.appendChild(script);
  }, []);

  const handleSuccess = (data) => {
    console.log('Selected Files:', data);
  };

  const handleAuthClick = () => {
    const clientId = '497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com';
    // const redirectUri = 'http://localhost:3000';
    const currentDomain = window.location.origin;

    const redirectUri = `${currentDomain}/auth-callback`;

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=https://www.googleapis.com/auth/drive.file`;

    // Redirect the user to Google for authentication
    window.location.href = authUrl;
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
    // Simulate sign out by clearing the oauthToken
    setOauthToken(null);
  };

  return (
    <div>
      {!oauthToken ? (
        <Button sx={style} component="label" onClick={handleAuthClick}>Authenticate with Google</Button>
      ) : (
        <>
          <Button sx={style} component="label" onClick={openPicker}>Open Google Picker</Button>
          <Button sx={style} onClick={handleSignOut}>Sign Out</Button>
        </>
      )}
    </div>
  );
};

export default GoogleDrivePick;
