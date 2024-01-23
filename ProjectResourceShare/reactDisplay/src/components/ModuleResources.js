import React, { Component, useEffect } from 'react';
import {useState} from 'react';
import { useLocation } from "react-router-dom";
import myAxiosInstance from '../axios';
import { Button, TextField } from '@mui/material';


export default function ModuleResources(){
        const [fileName, setFileName] = useState("");
        const [file, setFile] = useState([]);
        const [fileDescription, setFileDescription] = useState("");
        const [user, setUser] = useState({});
        
        const location = useLocation();

        let module = location.state;
        let requestData = {}

        useEffect(() => {
        myAxiosInstance.get('getUserDetail/').then((response) =>{
            setUser(response.data);
            console.log("user data: ", response.data);
            console.log("user: ", user);
            console.log("user id: ", user.id);
        })
        .catch((error) =>{
            console.log("error fetching user data: ", error);
        });
        },[user.id, module.id] );

        const handleFileChange = (e) =>{
            console.log(e.target.files[0]);
            setFile(e.target.files[0]);

        }

        const headers = {
            'Content-Type': 'multipart/form-data',
        }

      
        const handleSubmit = async (e) => {
            e.preventDefault();
            try{
                const formData = new FormData();
                formData.append('name', fileName);
                formData.append('description', fileDescription);
                console.log("File Value; ", file);
                //console.log("File Value; ", file.File);
                formData.append('resource', file);
                formData.append('module', module.id);
                formData.append('author', user.id);

                myAxiosInstance.post('resourceUpload/', formData, {
                headers: headers
              })
                .then((response) => {
                    console.log("file post success");
                })
                .catch((error)=> {
                    console.log("error in resourceUpload/ post ", error);
                });
            }catch(error){
                console.error("Failed form data or post: ", error);
            };
        }

        return (
            <>
                <div className='ModuleResourceTitles'>
                    <h1>{module.name}</h1>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <TextField 
                    label = "File Name"
                    value = {fileName}
                    onChange={(e)=> setFileName(e.target.value)}/>
                    <TextField
                    label = "File Description"
                    value = {fileDescription}
                    onChange={(e)=> setFileDescription(e.target.value)}/>

                    <input
                    type = "file"
                    onChange={handleFileChange}/>
                    <Button variant = "contained" type = "submit" value = "Submit">Submit</Button>
                </form>
                
            </>
            
        );
}