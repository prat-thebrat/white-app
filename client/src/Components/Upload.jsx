import React, { useState } from 'react';
import { storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import './Upload.css';

function Upload() {
  const [progress, setProgress] = useState(0);

  const formHandler = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    await uploadFiles(file);
  };

  const uploadFiles = async (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File uploaded successfully:', downloadURL);
        await triggerPythonScript(downloadURL);
      }
    );
  };

  const triggerPythonScript = async (downloadURL) => {
    try {
      const response = await axios.post('/api/process-csv', { downloadURL });
      console.log(response.data);
    } catch (error) {
      console.error('Error triggering Python script:', error);
    }
  };
  return (
    <div className="App">
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <h3>Uploaded {progress} %</h3>
    </div>
  );
  
}

export default Upload;
