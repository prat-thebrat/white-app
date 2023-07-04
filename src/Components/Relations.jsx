import React from "react";
import "../Components/Relations.css";


const Relations = () => {
    return (
        <>
            <div className="confirm">
                <h1> Confirm Relations...</h1>
            </div>
            <div className="okk" >
            <div className="chat-bubble">
            </div>

            </div>

            <div className="confirm-btn">
                    <a href="/confirm"><button className="confirmB" > Confirm! </button></a>
            </div>
            <div className="edit-btn">
                    <a href="/edit"><button className="editB" > Edit </button></a>
            </div>
        </>
    );
};

export default Relations;