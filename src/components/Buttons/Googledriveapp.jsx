import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TreeStateContext, useTreeState, useSelectedNodeState } from '../../contexts';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './buttons.css'
import { Button } from '@mui/material';
import { style } from './Button'
const Googledriveapp = () => {
  const [files, setFiles] = useState([]);
  console.log("🚀 ~ file: Googledriveapp.jsx:11 ~ Googledriveapp ~ files:", files)
  const [accessToken, setAccessToken] = useState('');
  const [data, setData] = useTreeState();
  const [modalShow, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useSelectedNodeState()
  const [currentpage, setcurrentPage] = useState(1)


  const MINIMUM_VALID_DURATION = 60;

  const initGoogleSignIn = () => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '990697486435-icl7vg6fnrh20fmjgdsu8j1orrudrmvk.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive',
      });
    });
  };

  const handleLogin = async () => {
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const user = await auth2.signIn();

      const tokenInfo = user.getAuthResponse();
      if (tokenInfo.expires_in < MINIMUM_VALID_DURATION) {
        console.warn('Token is about to expire. Handle token refresh.');
      }

      const token = tokenInfo.access_token;
      setAccessToken(token);
      fetchFiles(token, currentpage);

      handleModalOpen();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };



  const fetchFiles = async (token, pageNumber) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            pageSize: 100,
            fields: 'nextPageToken, files(id, name, mimeType)',
            // pageToken: pageNumber
          },
        }
      );

      const files = response.data.files;
      console.log('Fetched files:', files);

      setFiles(files);

    } catch (error) {
      console.error('Error fetching files:', error.message);
    }
  };

  const handleSuccess = async (fileId) => {
    try {
      const authHeader = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: authHeader, responseType: 'arraybuffer' }
      );

      if (response.status !== 200) {
        console.error('Error fetching file content. Status:', response.status);
        alert('Error fetching file content');
        return;
      }

      const fileContentArrayBuffer = response.data;
      const textDecoder = new TextDecoder('utf-8');
      const fileContentString = textDecoder.decode(fileContentArrayBuffer);

      try {
        const jsonData = JSON.parse(fileContentString);

        setData(jsonData);
        setSelectedNode(jsonData)
        console.log('Imported JSON file:', jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file');
      }
    } catch (error) {
      console.error('Error during file import:', error);
      alert(`Error importing file: ${error.message}`);
    }
  };


  useEffect(() => {
    initGoogleSignIn();
  }, []);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePageChange = (pageNumber) => {
    const nextPageToken = pageNumber > 1 ? files[files.length - 1].id : undefined;
    fetchFiles(accessToken, nextPageToken);
  };


  const PaginationBtn = () => {
    const totalpages = Math.ceil(files.length / 10)
    const pagibtn = []

    for (let i = 1; i <= totalpages; i++) {
      pagibtn.push(<button key={i} onClick={() => handlePageChange(i)}>
        {i}
      </button>)
    }
    return pagibtn;
  }

  const handleSignOut = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setAccessToken('');
      setFiles([]);
      setShowModal(false);
    });
  };

  const timestamp = new Date().toLocaleDateString("de-DE").replace(/\//g, '_');
  const fileName = `family_tree_export_${timestamp}.json`;
  const fileContent = JSON.stringify(data, null, 2);
  const mimeType = 'application/json';

  const onUpload = async () => {

    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const permissionUrl = 'https://www.googleapis.com/drive/v3/files';

    try {
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify({ name: fileName, mimeType: 'application/json', originalFilename: 'rtte.json' })], { type: 'application/json' }));
      formData.append('file', new Blob([fileContent], { type: mimeType }));

      const uploadResponse = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (uploadResponse.status === 200) {
        const fileId = uploadResponse.data.id;

        // Set permission for the file (make it accessible to anyone with the link)
        await axios.post(
          `${permissionUrl}/${fileId}/permissions`,
          {
            role: 'reader',
            type: 'anyone',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        alert(`File is exported to google drive:${fileName}`)

        // Construct the link to view the file in Google Drive
        const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;

        // Open the file in Google Drive
        window.open(driveUrl, '_blank');

      } else {
        alert(`Error uploading file to Google Drive:${fileName}`)
      }
    } catch (error) {
      alert(`Error uploading file:${error}`)
    }
  };




  return (
    <div>
      {!accessToken ? (<Button sx={style} component="label" onClick={handleLogin}>Login with Google</Button>) :
        (<Button sx={style} component="label" onClick={handleSignOut}>Sign Out</Button>)}

      <Modal
        show={modalShow}
        onHide={handleModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select Files
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {files.map((file) => (

              <li key={file.id} className='drive-file'>
                <div>{file.name} - {file.mimeType} </div>
                <div> <button component="label" className='import-button' onClick={() => handleSuccess(file.id)}>Import</button> </div>
              </li>


            ))}
          </ul>
          {/* <div>{PaginationBtn()}</div> */}
        </Modal.Body>
        <Modal.Footer>
          <button className='import-button' component="label" onClick={handleModalClose}>Close</button>
        </Modal.Footer>
      </Modal>
      <Button sx={style} component="label" onClick={() => onUpload()}>
        Export JSON
      </Button>
    </div>
  );
};

export default Googledriveapp;