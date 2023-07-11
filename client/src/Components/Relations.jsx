import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Components/Relations.css';

const Relations = () => {
  const [outputText, setOutputText] = useState('');

  useEffect(() => {
    fetchOutputText();
  }, []);

  const fetchOutputText = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/output/latest');
      const { data } = response;
      setOutputText(data.outputText);
    } catch (error) {
      console.error('Error fetching output text:', error);
    }
  };
  
  

  return (
    <>
      <div className="confirm">
        <h1>Confirm Relations...</h1>
      </div>
      <div className="okk">
        <div className="chat-bubble chat-text-center" >
            <div className='relation'>
                {outputText}
            </div>
        </div>
      </div>

      <div className="confirm-btn">
        <a href="/confirm">
          <button className="confirmB">Confirm!</button>
        </a>
      </div>
      <div className="edit-btn">
        <a href="/edit">
          <button className="editB">Edit</button>
        </a>
      </div>
    </>
  );
};

export default Relations;