import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import queryString from 'query-string';
import { style } from './Button';
import { useTreeState, useSelectedNodeState } from '../../contexts';


const GoogleDrivePick = () => {
  const [oauthToken, setOauthToken] = useState(null);
  console.log("oauthToken", oauthToken)
  const [data, setData] = useTreeState();
  // const setSelectedNode = useSelectedNodeState()[1];
  const [selectedNode, setSelectedNode] = useSelectedNodeState()

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
          apiKey: 'AIzaSyC-X1OtXh97rucjKLeGhsX0j4UJdFEoF1M',
          clientId: '990697486435-icl7vg6fnrh20fmjgdsu8j1orrudrmvk.apps.googleusercontent.com',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file',
        }).then(() => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          const isSignedIn = authInstance.isSignedIn.get();

          if (isSignedIn) {
            const currentUser = authInstance.currentUser.get();

            if (currentUser) {
              const authResponse = currentUser.getAuthResponse();
              setOauthToken(authResponse.access_token);
            }
          }
        });
      });

    };
    document.head.appendChild(script);
  }, []);


  // const updateTreeStateWithFiles = (selectedFiles) => {

  //   selectedFiles.forEach((file) => {
  //     const reader = new FileReader();


  //     reader.onload = (e) => {
  //       try {

  //         const jsonData = JSON.parse(e.target.result);

  //         setData((prevData) => {
  //           const updatedData = { ...prevData };


  //           extractNodesFromJson(jsonData, updatedData);

  //           return updatedData;
  //         });


  //         setSelectedNode(jsonData);
  //       } catch (error) {

  //         console.error('Error parsing JSON:', error);
  //         alert('Invalid JSON file');
  //       }
  //     };


  //     reader.readAsText(file);
  //   });
  // };

  // const extractNodesFromJson = (jsonData, updatedData, currentPath = '') => {

  //   if (typeof jsonData === 'object' && jsonData !== null) {

  //     for (const [key, value] of Object.entries(jsonData)) {

  //       const newPath = currentPath ? `${currentPath}.${key}` : key;


  //       updatedData[newPath] = {
  //         id: newPath,
  //         Name: key,

  //       };


  //       extractNodesFromJson(value, updatedData, newPath);
  //     }
  //   }
  // };


  const handleSuccess = (data) => {
    console.log('Selected Files:', data);

    if (data.docs && data.docs.length > 0) {
      const selectedFile = data.docs[0];
      console.log('Selected File ID:', selectedFile.id);

      window.gapi.client.drive.files
        .get({
          fileId: selectedFile.id,
          alt: 'media',
        })
        .then((response) => {
          const fileContent = response.body;

          try {

            const jsonData = JSON.parse(fileContent);
            setData(jsonData)

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

  const handleAuthClick = () => {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signIn().then(
        (user) => {
          console.log('Authenticated. Token:', user.getAuthResponse().access_token);
          setOauthToken(user.getAuthResponse().access_token);
        },
        (error) => {
          console.error('Authentication error:', error);
        }
      );
    } else {
      console.error('Google API client library not fully loaded.');
    }
  };

  const handlePickerClose = () => {
    console.log('User closed the Google Picker.');
  };

  function getOrigin() {
    var url = window.google.script.host.origin;
    return url.substr(url.length - 1) === "/" ? url.substr(0, url.length - 1) : url;
  }

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
        .setDeveloperKey('AIzaSyC-X1OtXh97rucjKLeGhsX0j4UJdFEoF1M')
        .setOrigin(window.location.protocol + '//' + window.location.host)
        .setRelayUrl(window.location.host)
        .setAppId('family-tree-406710')
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
    window.gapi.load('picker', () => {
    });
  }, []);

  useEffect(() => {
    console.log('Google Picker API loaded:', window.google && window.google.picker);
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