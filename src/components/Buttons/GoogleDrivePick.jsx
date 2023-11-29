import React, { useState } from 'react';
import GooglePicker from 'react-google-picker';

const GoogleDrivePick = () => {
  const [pickedFile, setPickedFile] = useState(null);

  const handleSuccess = (data) => {
    console.log('Google Drive Picker Success:', data);
    setPickedFile(data.docs[0]);
    // Now, you can import the selected file or perform any other action
  };

  const handleError = (data) => {
    console.log('Google Drive Picker Error:', data);
  };

  return (
    <div>
      <GooglePicker
        clientId="497857861442-20nqo8l8q627tebrkm3bfhqb9nl1itsl.apps.googleusercontent.com"
        developerKey="AIzaSyDRBMb3f8y_DY4_TCpJeo3vO5ctJsd7YHg"
        scope={['https://www.googleapis.com/auth/drive.file']}
        onChange={handleSuccess}
        onError={handleError}
      >
        <button>Select File from Google Drive</button>
      </GooglePicker>

      {pickedFile && (
        <div>
          <h4>Selected File:</h4>
          <p>Name: {pickedFile.name}</p>
          <p>ID: {pickedFile.id}</p>
          {/* You can import the file or perform any other action here */}
        </div>
      )}
    </div>
  );
};

export default GoogleDrivePick;
