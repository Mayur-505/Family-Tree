import { useEffect, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker'


function Googledriveapp() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [datas, setData] = useState()
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: "990697486435-icl7vg6fnrh20fmjgdsu8j1orrudrmvk.apps.googleusercontent.com",
      developerKey: "AIzaSyC-X1OtXh97rucjKLeGhsX0j4UJdFEoF1M",
      viewId: "DOCS",
      token: 'ya29.a0AfB_byBlJ5l9vRmwGIvUBZzRsGPNHd6dbvtoe28l_Jx_4oqLT1YVcjPnGFD-sRu66XefzEXwwPdZSFkorw3i_VlgBa0HdIUBi1JgsqUmn2PvqVw-UelLKZH76-CopTxh7zE3hVmQodG-_sjhexz_4BwyL7uT-GvpBvjqaCgYKAc8SARESFQHGX2MifYbCKbU9fvmNtDRAjE9WXQ0171', // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)
      },
    })
  }

  useEffect(() => {
    if (data) {
      data.docs.map((i) => console.log(i))

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
    }
  }, [data])


  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default Googledriveapp;