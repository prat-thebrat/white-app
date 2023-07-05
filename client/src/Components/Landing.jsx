import "./Landing.css"
import logo from "../assets/oioi.png";
import React from "react";

const Landing = () => {
    return (
        <>
            <div className="logo">
                <img src={logo} className="carok" />   
            </div>
            <div className="get-started-btn">
                    <a href="/upload"><button className="getstartedB" >Get Started!</button></a>
            </div>
        </>
    );
};

export default Landing;