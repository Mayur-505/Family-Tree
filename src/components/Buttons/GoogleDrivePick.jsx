import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { style } from './Button';

const CLIENT_ID = "497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com";
const API_KEY = "AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg";
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const GoogleDrivePick = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileContent, setFileContent] = useState([]);

  const handleImportClick = () => {
    loadPickerApi(() => {
      initClient();
    });
  };

  const loadPickerApi = (callback) => {
    if (!window.google || !window.google.picker) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('picker', callback);
      };
      document.head.appendChild(script);
    } else {
      callback();
    }
  };

  const initClient = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: SCOPES,
    }).then(() => {
      // After initClient, authenticate the user and list files
      window.gapi.auth2.getAuthInstance().signIn().then(() => {
        // Display the Google Picker when the user is authenticated
        showPicker();
      });
    });
  };

  const showPicker = () => {
    // Use the Google Picker API to allow the user to select a file
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(window.gapi.auth.getToken().access_token)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = (data) => {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      setSelectedFile(data.docs[0]);

      fetchFileContent(fileId);
    }
  };

  const fetchFileContent = (fileId) => {
    window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    }).then(response => {
      setFileContent(response.body);
    });
  };

  return (
    <div>
      <Button sx={style} component="label" onClick={handleImportClick}>
        Import Files from Google Drive
      </Button>

      {/* {selectedFile && (
        <div>
          <Typography variant="h6">Selected File:</Typography>
          <pre>{JSON.stringify(selectedFile, null, 2)}</pre>
        </div>
      )}

      {fileContent && (
        <div>
          <Typography variant="h6">File Content:</Typography>
          <pre>{fileContent}</pre>
        </div>
      )} */}
    </div>
  );
};

export default GoogleDrivePick;
