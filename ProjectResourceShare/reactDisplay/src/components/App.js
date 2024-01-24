import React, { Component, useEffect, useState, useContext } from "react";
import { createRoot } from 'react-dom/client';
//import ModuleFilesPage from "./ModuleFilesPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Register";
import HomePage from "./HomePage";
import Login from "./Login";
import Navbar from "./Navbar";
import Logout from "./Logout";
import ModuleResources from "./ModuleResources";
import { StrictMode } from "react";
import { Module } from "webpack";

export const Context = React.createContext();

//TODO: navigation bar dynamic based on auth, test axios interceptor. & authentication.
export default function App() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    /*useEffect( () =>{
      const accessToken = localStorage.getItem("accessToken");
      setIsAuthorized(accessToken != null);
      console.log("IsAuthorized: ", isAuthorized);
    }, [isAuthorized]); //empty array is a dependancy array*/

        return (
            <Context.Provider value = {[isAuthorized, setIsAuthorized]}>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route exact path = "/register" element = { <Register/> }/>
                        <Route exact path = "/home" element = { <HomePage/> }/>
                        <Route exact path = "/login" element = { <Login/> }/>
                        <Route exact path = "/" element  = { <Login/> }/>
                        <Route exact path = "/logout" element = {<Logout/>} />
                        <Route exact path = "/ModuleResources" element = {<ModuleResources/>} />
                    </Routes>
                </BrowserRouter>
            </Context.Provider>
         );
    
}


const appRoot = createRoot(document.getElementById('reactApp'));
appRoot.render(
<StrictMode>
<App/>
</StrictMode>);


/*
const mainAppDiv = document.getElementById("reactApp");
render(<App/>, mainAppDiv);
*/