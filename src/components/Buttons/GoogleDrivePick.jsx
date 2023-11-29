import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import queryString from 'query-string';
import { style } from './Button';
import { useTreeState, useSelectedNodeState } from '../../contexts';

const GoogleDrivePick = () => {
  const [oauthToken, setOauthToken] = useState(null);
  const [selectedNode, setSelectedNode] = useSelectedNodeState();
  const [treeState, setTreeState] = useTreeState();
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);

  useEffect(() => {
    const { access_token } = queryString.parse(window.location.hash);

    if (access_token) {
      setOauthToken(access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const updateTreeStateWithFiles = (selectedFiles) => {
    const newNodes = selectedFiles.map((file) => {
      return {
        id: file.id,
        Name: file.name,
        // Add other properties based on your file structure
      };
    });

    setTreeState((prevData) => {
      const updatedData = { ...prevData };
      newNodes.forEach((node) => {
        updatedData[node.id] = node;
      });
      return updatedData;
    });
  };

  const handleSuccess = (data) => {
    console.log('Selected Files:', data);

    // Filter files to include only those with JSON content (if needed)
    const jsonFiles = data.docs.filter((file) => file.mimeType === 'application/json');

    updateTreeStateWithFiles(jsonFiles);
  };

  const handleAuthClick = () => {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signIn().then((user) => {
        setOauthToken(user.getAuthResponse().access_token);
        console.log('Authenticated. Token:', user.getAuthResponse().access_token);
      });
    } else {
      console.error('Google API client library not fully loaded.');
    }
  };

  const openPicker = () => {
    console.log('OAuth Token:', oauthToken);

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
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signOut().then(() => {
        setOauthToken(null);
      });
    }
  };

  useEffect(() => {
    const loadClient = async () => {
      try {
        await window.gapi.client.init({
          apiKey: 'AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg',
          clientId: '497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        });

        // Optionally, you can check the sign-in status here
        // const auth2 = window.gapi.auth2.getAuthInstance();
        // auth2.isSignedIn.listen(updateSigninStatus);
        // updateSigninStatus(auth2.isSignedIn.get());
      } catch (error) {
        setIsLoadingGoogleDriveApi(false);
        console.error('Error initializing Google API client:', error);
      }
    };

    if (window.gapi && window.gapi.auth2) {
      loadClient();
    } else {
      console.error('Google API client library not loaded.');
    }
  }, []);

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

export default GoogleDrivePick
