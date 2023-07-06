import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Components/Upload.css";

function Upload() {
  const [progress, setProgress] = useState(0);
  const navigateTo = useNavigate();

  const formHandler = async (e) => {
    e.preventDefault();
    const files = e.target[0].files;
    await processFiles(files);
  };

  const processFiles = async (files) => {
    if (files.length === 0) return;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setProgress(progress);
        },
      });

      const downloadURL = response.data.download_url;
      console.log('File uploaded successfully:', downloadURL);

      // Redirect to "/relations" after successful upload
      navigateTo('/relations');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <div className='upload'>
        <h1>Upload Files...</h1>
      </div>
      <form onSubmit={formHandler} className='okkk'>
        <input type="file" className="choose-fileB" multiple />
        <div className='upload-btn'>
          <button className="uploadB" type="submit">Submit!</button>
        </div>
      </form>
      <hr />
      <div className='progress'>
        <h3>Uploaded {progress} %</h3>
      </div>
    </>
  );
}

export default Upload;
