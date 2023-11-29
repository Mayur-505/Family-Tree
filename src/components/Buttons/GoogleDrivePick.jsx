import React, { useState, useEffect } from 'react';
import { GooglePicker } from 'react-google-picker';
import queryString from 'query-string';

const GoogleDrivePick = () => {
  const [oauthToken, setOauthToken] = useState(null);

  useEffect(() => {
    // Check if the URL contains an access token after redirection
    const { access_token } = queryString.parse(window.location.hash);

    if (access_token) {
      // Update state with the obtained access token
      setOauthToken(access_token);

      // Clear the URL hash to avoid exposing the token
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSuccess = (data) => {
    console.log('Selected Files:', data);
  };

  const handleAuthClick = () => {
    const clientId = '497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000';

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=https://www.googleapis.com/auth/drive.file`;

    // Redirect the user to Google for authentication
    window.location.href = authUrl;
  };

  const openPicker = () => {
    if (!oauthToken) {
      console.error('Authentication required. Please authenticate first.');
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

  return (
    <div>
      <button onClick={handleAuthClick}>Authenticate with Google</button>
      <button onClick={openPicker} disabled={!oauthToken}>
        Open Google Picker
      </button>
    </div>
  );
};

export default GoogleDrivePick;
