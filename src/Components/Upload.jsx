// import React, { useState } from 'react';
// import { storage } from '../Firebase'; // Update the import path
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Add getDownloadURL import

// function Upload() {
//   const [progress, setProgress] = useState(0);

//   const formHandler = (e) => {
//     e.preventDefault();
//     const file = e.target[0].files[0];
//     uploadFiles(file);
//   };

//   const uploadFiles = (file) => {
//     if (!file) return;
//     const storageRef = ref(storage, `/files/${file.name}_${Date.now()}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//         setProgress(prog);
//       },
//       (error) => {
//         console.error('Error uploading file:', error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//           console.log('File uploaded successfully:', url);
//         });
//       }
//     );
//   };

//   return (
//     <div className="App">
//       <form onSubmit={formHandler}>
//         <input type="file" className="input" />
//         <button type="submit">Upload</button>
//       </form>
//       <hr />
//       <h3>Uploaded {progress} %</h3>
//     </div>
//   );
// }

// export default Upload;

// import React, { useState } from 'react'
// import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
// import { storage } from '../Firebase';
// import Details from './Details';



// const FileUpload = (list, setter) => {


//     const [progrss, setProgrss] = useState(0);
//     const [isLoading, setIsLoading] = useState();
//     const [file, setFile] = useState();
//     const [url, setUrl] = useState();


//     const onFileUpload = () => {
//         if (!file) return;
//         setIsLoading(true);
//         const storageRef = ref(storage, `/files/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         uploadTask.on("state_changed", (snapshot) => {
//             var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//             setProgrss(progress);
//         }, (err) => {
//             console.log(err);
//             setIsLoading(false);
//         },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref)
//                     .then(url => {
//                         setUrl(url);
//                         setIsLoading(false);
//                     })
//             }
//         )
//     }

//     const onFileChange = e => {
//         setFile(e.target.files[0]);
//         e.preventDefault();
//     }


//     return (
//         <>
//             <input type="file" onChange={onFileChange} />
//             <button onClick={onFileUpload}>
//                 Upload!
//             </button>
//             <div className="break"></div>
//             {isLoading && <p>File upload <b>{progrss}%</b></p>}
//             {url && <p>Firebase storage URL: <a href={url} target="_blank" rel="noreferrer">{url}</a></p>}
//         </>

//     )
// }

// export default FileUpload

import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';
import Details from './Details';

const FileUpload = (list, setter) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);

  const onFileUpload = () => {
    if (files.length === 0) return;
    setIsLoading(true);
    const uploadTasks = [];
    
    files.forEach(file => {
      const fileName = `${file.name}`;
      const storageRef = ref(storage, `/files/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTasks.push(uploadTask);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        err => {
          console.log(err);
          setIsLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(url => {
              setUrls(prevUrls => [...prevUrls, url]);
              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
              setIsLoading(false);
            });
        }
      );
    });

    Promise.all(uploadTasks)
      .then(() => {
        console.log('All files uploaded successfully');
      })
      .catch(err => {
        console.log('Error uploading files:', err);
      });
  };

  const onFileChange = e => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    e.preventDefault();
  };

  return (
    <>
      <input type="file" onChange={onFileChange} multiple />
      <button onClick={onFileUpload}>Upload!</button>
      <div className="break"></div>
      {isLoading && <p>File upload <b>{progress}%</b></p>}
      {urls.map(url => (
        <p key={url}>
          Firebase storage URL: <a href={url} target="_blank" rel="noreferrer">{url}</a>
        </p>
      ))}
    </>
  );
};

export default FileUpload;
