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
        const [fileResetKey, setFileResetKey] = useState(0);
        
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

        useEffect( () =>{

            myAxiosInstance.get('/').then((response) =>{
                console.log(response.data)
                setModules(response.data)
                
            })
            .catch((error) =>{
                console.error("error fetching data: ", error);
            });
        }, []);

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
                formData.append('resource', file);
                formData.append('module', module.id);
                formData.append('author', user.id);

                myAxiosInstance.post('resourceUpload/', formData, {
                headers: headers
              })
                .then((response) => {
                    setFile([]);
                    setFileDescription("");
                    setFileName("");
                    setFileResetKey(key => key + 1);
                    console.log("file post success!");
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
                {/*
                <div className = "ModuleList">
                    <List component = {Stack} direction = "row">
                        {.map(function(, i){
                            return <ListItem key={i}>{.name} 
                                <Button onClick={() => handleRedirect()}>
                                    See File Resources
                                </Button>
                            </ListItem>
                        })}
                    </List>
                </div>
                    */}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <TextField 
                    label = "File Name"
                    value = {fileName}
                    onChange={(e)=> setFileName(e.target.value)}/>
                    <TextField
                    label = "File Description"
                    value = {fileDescription}
                    onChange={(e)=> setFileDescription(e.target.value)}/>

                    <TextField
                    type = "file"
                    onChange={handleFileChange}
                    key = {fileResetKey}/>
                    <Button variant = "contained" type = "submit" value = "Submit">Submit</Button>
                </form>
                
            </>
            
        );
}