import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import queryString from 'query-string';
import { style } from './Button';
import { useTreeState, useSelectedNodeState } from '../../contexts';
import FolderStructure from '../layouts/FolderStructure';

const GoogleDrivePick = () => {
  const [oauthToken, setOauthToken] = useState(null);
  const [data, setData] = useTreeState();
  const setSelectedNode = useSelectedNodeState()[1];

  useEffect(() => {
    const { access_token } = queryString.parse(window.location.hash);

    if (access_token) {
      setOauthToken(access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: 'AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg',
          clientId: '497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file',
        }).then(() => {
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

  // ...

  const updateTreeStateWithFiles = (selectedFiles) => {

    selectedFiles.forEach((file) => {
      const reader = new FileReader();


      reader.onload = (e) => {
        try {

          const jsonData = JSON.parse(e.target.result);

          setData((prevData) => {
            const updatedData = { ...prevData };


            extractNodesFromJson(jsonData, updatedData);

            return updatedData;
          });


          setSelectedNode(jsonData);
        } catch (error) {

          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file');
        }
      };


      reader.readAsText(file);
    });
  };

  const extractNodesFromJson = (jsonData, updatedData, currentPath = '') => {

    if (typeof jsonData === 'object' && jsonData !== null) {

      for (const [key, value] of Object.entries(jsonData)) {

        const newPath = currentPath ? `${currentPath}.${key}` : key;


        updatedData[newPath] = {
          id: newPath,
          Name: key,

        };


        extractNodesFromJson(value, updatedData, newPath);
      }
    }
  };


  const handleSuccess = (data) => {
    console.log('Selected Files:', data);


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

  const handlePickerClose = () => {
    console.log('User closed the Google Picker.');
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
        .setOrigin(window.location.protocol + '//' + window.location.host)
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

  return (
    <div>
      {!oauthToken ? (
        <Button sx={style} component="label" onClick={handleAuthClick}>
          Authenticate with Google
        </Button>
      ) : (
        <>
          <Button sx={style} component="label" onClick={openPicker}>
            Choose File from Google Drive
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
