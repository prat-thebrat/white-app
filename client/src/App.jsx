import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './Components/Footer';
import Landing from './Components/Landing';
import Relations from './Components/Relations';
import FileUpload from './Components/Upload';
import axios from 'axios';



const App = () => {

  useEffect(() => {
    // axios.get(https://jsonplaceholder.typicode.com/todos)
    axios.get("https://jsonplaceholder.typicode.com/todos").then((response) => {
      console.log(response.data);
    });
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />      
          <Route path="/upload" element={<FileUpload />} /> 
          <Route path="/relations" element={<Relations />} />   
        </Routes>
      </Router>
      <Footer />
    </>
  )
}

export default App;
