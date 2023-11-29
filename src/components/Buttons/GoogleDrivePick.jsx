import React, { useState, useEffect } from 'react';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const CLIENT_ID = '497857861442-obkjgko2u2olskde533rvf6i21f2khd3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg';

const GoogleDrivePick = () => {
  const [files, setFiles] = useState([]);

  const authenticate = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();

        // Check if the user is already signed in
        if (!authInstance.isSignedIn.get()) {
          // If not, show the sign-in popup
          authInstance.signIn().then(() => {
            listFiles();
          });
        } else {
          // If already signed in, proceed to list files
          listFiles();
        }
      });
    });
  };

  const listFiles = async () => {
    try {
      const response = await window.gapi.client.drive.files.list({
        pageSize: 10,
        fields: 'files(id, name)',
      });
      const files = response.result.files;
      setFiles(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const handleFileSelect = async (fileId) => {
    try {
      // Export the content of the selected file
      const response = await window.gapi.client.drive.files.export({
        fileId: fileId,
        mimeType: 'text/plain', // Adjust the mimeType based on the file type
      });

      const fileContent = response.body;

      // Log the content of the selected file
      console.log('Selected File Content:');
      console.log(fileContent);

      // Perform additional actions based on your requirements
      // For example, you can store the content in your React state
      // or dispatch an action to update your Redux store
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };


  return (
    <div>
      <h1>Google Drive Files</h1>
      <button onClick={authenticate}>Sign In</button>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.name}{' '}
            <button onClick={() => handleFileSelect(file.id)}>Select</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleDrivePick;
