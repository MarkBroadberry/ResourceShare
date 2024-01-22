import React, { Component } from 'react';
import {useState} from 'react';
import { useLocation } from "react-router-dom";


export default function ModuleResources(){
        const location = useLocation();
        let module = location.state.name;

    //render()
        return (
            <>
                <div className='ModuleResourceTitles'>
                    <h1>{module}</h1>
                </div>
                
            </>
            
        );
}

function FileForm(){
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    return(
        <form>
            <label>
                File Name:
                <input type = "text" 
                value = {fileName}
                onChange={(e)=> setFileName(e.target.value)}/>
            </label>
            <label>
                Upload File:
                <input type = "file"
                value = {file}
                onChange={(e)=> setFile(e.target.value)}/>
            </label>
            <input type = "submit" value = "Submit"/>

        </form>
    )
}