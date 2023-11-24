import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { Button } from '@mui/material';
import { style } from './Button'


function GoogleApi() {
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  const CLIENT_ID = "497857861442-b3gssphp0bh6ak235826pu2r9l47i8cs.apps.googleusercontent.com";
  const API_KEY = "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";

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


  useEffect(() => {
    gapi.load('client:auth2', initClient);
  }, []);


  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
    setIsSignedIn(false);
  };



  return (
    <div>
      {
        isSignedIn ? (<Button sx={style} component="label" onClick={handleSignOutClick}>
          Signout to Google Drive
        </Button>) : (<Button sx={style} component="label" onClick={handleClientLoad}>
          Connect to Google Drive
        </Button>)
      }

    </div>
  );
}

export default GoogleApi;
