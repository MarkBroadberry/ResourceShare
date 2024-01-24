import React, { Component, useEffect } from 'react';
import {useState} from 'react';
import { useLocation } from "react-router-dom";
import myAxiosInstance from '../axios';
import { Button, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';

export default function ModuleResources(){
        const [fileName, setFileName] = useState("");
        const [file, setFile] = useState([]);
        const [fileDescription, setFileDescription] = useState("");
        const [user, setUser] = useState({});
        const [fileResetKey, setFileResetKey] = useState(0);
        const [resources, setResources] = useState([]);
        
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

            myAxiosInstance.get(`getResources/module/${module.id}/`).then((response) =>{
                console.log("resources: ", response.data);
                setResources(response.data);
                console.log("author: ", response.data[0].author);
                console.log("resource: ", response.data[0].resource);
                console.log("test");
            })
            .catch((error) =>{
                console.error("error fetching resources data: ", error);
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

                <h3>Resources for this Module</h3>

                    <List component = {Stack} spacing = {2} direction = "row">
                        {resources.map(function(resource){
                            return(
                            <div className = "ResourceList" key = {resource.id}>
                                <ListItem>
                                    <Stack spacing = {2}>
                                    <iframe src={resource.resource}/>
                                    <p>File Name: {resource.name}</p>
                                    <p>Author: {resource.author.first_name} {resource.author.last_name}</p>
                                    </Stack>
                                </ListItem>
                            </div>)
                        })}
                    </List>
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