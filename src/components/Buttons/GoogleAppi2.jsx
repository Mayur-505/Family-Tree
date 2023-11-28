import React, { useState, useRef } from 'react';
import { Button } from '@mui/material';
import { useTreeState, useSelectedNodeState } from '../../contexts';
import { style } from './Button';
import { gapi } from 'gapi-script';

export const GoogleApi2 = () => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);
  const [data, setData] = useTreeState();
  const [selectedNode, setSelectedNode] = useSelectedNodeState();

  const handleFileUpload = (file) => {
    const fr = new FileReader();
    fr.onload = function (e) {
      try {
        const result = JSON.parse(e.target.result);
        const formatted = JSON.stringify(result, null, 2);
        result.value = formatted;

        setData(result);
        setSelectedNode(result);
      } catch (error) {
        alert('Invalid JSON file');
      } finally {
        setIsUploading(false);
      }
    };

    fr.readAsText(file);
  };

  const handlePickerSelection = (data) => {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const selectedFileId = data.docs[0].id;
      setIsUploading(true);

      gapi.client.drive.files
        .get({ fileId: selectedFileId, alt: 'media' })
        .then((response) => {
          handleFileUpload(new Blob([response.body], { type: 'application/json' }));
        })
        .catch((error) => {
          console.error('Error fetching file content:', error);
          setIsUploading(false);
        });
    }
  };

  function loadPickerAPI() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }


  const openPicker = () => {
    if (window.google && window.google.picker) {
      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.DocsView())
        .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
        .setDeveloperKey('AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg')
        .setCallback(handlePickerSelection)
        .build();

      picker.setVisible(true);
    } else {
      // Load the Picker API dynamically (assuming you have the necessary script)
      loadPickerAPI().then(() => {
        // Retry opening the picker
        openPicker();
      });
    }
  };


  const handleUploadClick = () => {
    inputRef.current.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setIsUploading(true);
      handleFileUpload(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        id="upload"
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
      <Button sx={style} onClick={openPicker} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Import JSON from Google Drive'}
      </Button>
    </div>
  );
};

export default GoogleApi2