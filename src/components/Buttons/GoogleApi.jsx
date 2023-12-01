import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { Button } from '@mui/material';
import { style } from './Button';
import { useTreeState, useSelectedNodeState } from '../../contexts';
function GoogleApi() {
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [fileId, setFile] = useState([])
  const [oauthToken, setOauthToken] = useState(null);
  const [data, setData] = useTreeState();
  const setSelectedNode = useSelectedNodeState()[1];

  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  const CLIENT_ID = "990697486435-icl7vg6fnrh20fmjgdsu8j1orrudrmvk.apps.googleusercontent.com";
  const API_KEY = "AIzaSyC-X1OtXh97rucjKLeGhsX0j4UJdFEoF1M";

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

  const handleSuccess = (data) => {
    console.log('Selected Files:', data);

    if (data.docs && data.docs.length > 0) {
      const selectedFile = data.docs[0];
      console.log('Selected File ID:', selectedFile.id);

      // Use the file ID to retrieve file content from Google Drive API
      window.gapi.client.drive.files
        .get({
          fileId: selectedFile.id,
          alt: 'media',
        })
        .then((response) => {
          const fileContent = response.body;

          try {
            // Now you can parse and use the file content as needed
            const jsonData = JSON.parse(fileContent);
            setData(jsonData)

            console.log('Imported JSON file:', jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Invalid JSON file');
          }
        })
        .catch((error) => {
          console.error('Error fetching file content:', error);
          alert('Error fetching file content');
        });
    } else {
      console.log('No files selected.');
    }
  };

  const openFilePicker = () => {
    console.log('OAuth Token:', oauthToken);

    if (!isSignedIn || !window.gapi) {
      console.error('Authentication required. Please authenticate first or check Google API availability.');
      return;
    }

    window.gapi.load('picker', () => {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(isSignedIn)
        .setDeveloperKey('AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg')
        .setCallback(handleSuccess)
        .setOrigin(window.location.protocol + '//' + window.location.host)
        .build();

      picker.setVisible(true);
    });
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
