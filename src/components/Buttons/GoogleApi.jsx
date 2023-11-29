import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { Button } from '@mui/material';
import { style } from './Button';

function GoogleApi() {
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [fileId, setFile] = useState([])

  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  const CLIENT_ID = "497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg";

  const updateSigninStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
    setIsLoadingGoogleDriveApi(false);
  };

  const initClient = async () => {
    setIsLoadingGoogleDriveApi(true);
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    } catch (error) {
      setIsLoadingGoogleDriveApi(false);
    }
  };

  const handleClientLoad = () => {
    const auth2 = gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
      auth2.signOut().then(() => {
        auth2.disconnect();
        setIsSignedIn(false);
        auth2.signIn({ prompt: 'select_account' });
      });
    } else {
      auth2.signIn({ prompt: 'select_account' });
    }
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
    setIsSignedIn(false);
  };

  const openFilePicker = () => {
    console.log('gapi.auth.getToken().access_token', API_KEY);
    const picker = new window.google.picker.PickerBuilder()
      .addView(new window.google.picker.DocsView())
      .setOAuthToken(gapi.auth.getToken().access_token)
      .setDeveloperKey(API_KEY)
      .setCallback((data) => {
        console.log('data ++ ', data);
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
          const fileId = data[window.google.picker.Response.DOCUMENTS][0].id;

          setFile(fileId)
        }
      })
      .build();

    picker.setVisible(true);
  };

  useEffect(() => {
    gapi.load('client:auth2', initClient);
    gapi.load('picker', () => {
    });
  }, []);

  return (
    <div>
      {isSignedIn ? (
        <div>
          <Button sx={style} component="label" onClick={handleSignOutClick}>
            Signout from Google Drive
          </Button>
          <Button sx={style} component="label" onClick={openFilePicker}>
            Open Google Drive Picker
          </Button>
        </div>
      ) : (
        <Button sx={style} component="label" onClick={handleClientLoad}>
          Connect to Google Drive
        </Button>
      )}


    </div>
  );
}

export default GoogleApi;
