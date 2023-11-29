import React, { useState, useEffect } from 'react';

const GoogleDrivePick = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Load the Google API Client
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => { };
    document.body.appendChild(script);
  }, []);

  const initializePicker = () => {
    window.gapi.load('picker', () => {
      // Create a Picker instance
      const picker = new window.google.picker.PickerBuilder()
        .addViewGroup(
          new window.google.picker.ViewGroup(window.google.picker.ViewId.DOCS)
            .addView(window.google.picker.ViewId.DOCUMENTS)
        )
        .setOAuthToken(window.gapi.auth.getToken().access_token)
        .setDeveloperKey('AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg')
        .setCallback(pickerCallback)
        .build();

      // Show the Picker
      picker.setVisible(true);
    });
  };

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const selectedFile = data.docs[0];
      console.log('Selected file:', selectedFile);
      // Perform actions with the selected file, e.g., download, display details, etc.
    }
  };

  const handleImportClick = () => {
    // Trigger the file picker when the "Import from Google Drive" button is clicked
    initializePicker();
  };

  return (
    <div>

      <button onClick={handleImportClick}>Import from Google Drive</button>
    </div>
  );
};

export default GoogleDrivePick;
