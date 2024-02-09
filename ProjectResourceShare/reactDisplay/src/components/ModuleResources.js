import React, { Component, useEffect } from 'react';
import {useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import myAxiosInstance from '../axios';
import { Button, TextField, Card, CardContent, CardActions, Typography, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import fileDownload from 'js-file-download';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PersonIcon from '@mui/icons-material/Person';


export default function ModuleResources(){
        const [fileName, setFileName] = useState("");
        const [file, setFile] = useState([]);
        const [fileDescription, setFileDescription] = useState("");
        const [user, setUser] = useState({});
        const [fileResetKey, setFileResetKey] = useState(0);
        const [resources, setResources] = useState([]);
        
        const location = useLocation();
        const navigate = useNavigate();

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
        },[user.id] );

        useEffect( () =>{

            myAxiosInstance.get(`getResources/module/${module.id}/`).then((response) =>{
                console.log("resources: ", response.data);
                setResources(response.data);
                console.log("author: ", response.data[0].author);
                console.log("resource: ", response.data[0].resource);
                console.log("resourceID: ", response.data[0].id);
                /*myAxiosInstance.get('getUserDetail')*/
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
                formData.append('author', user.id);
                formData.append('module', module.id);
                console.log("form data appended", user.id, module.id)

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

        const downloadFile = (fileName) =>{
            console.log("resource.resource1: ", fileName);
            fileName = fileName.replace('/media/uploads/', "");
            console.log("replaced:",fileName);
            console.log(fileName[0]);
            myAxiosInstance.get(`download/${fileName}/`, {responseType : 'blob',}).then((response)=>{
                console.log(response.data);
                fileDownload(response.data, fileName);
            })
        }

        const handleRedirect = (chosenResource) => navigate('/ResourceRatings',{state: chosenResource});


        return (
            <>
                <div className='ModuleResourceTitles'>
                    <h1>{module.name}</h1>
                </div>

                <h3>Resources for this Module</h3>

                    <List component = {Stack} spacing = {2} direction = "row" style = {{overflow: 'auto'}}>
                        {resources.map(function(resource){
                            return(
                                <ListItem key = {resource.id}>
                                    <Card sx = {{width: '100%'}} key = {resource.id}>
                                        <CardContent>
                                            <Box style = {{display:'flex', marginBottom: '2%', justifyContent: 'center'}}>
                                                <FilePresentIcon/>
                                                <Typography>{resource.name}</Typography>
                                                <Box style = {{marginLeft : 'auto'}}>
                                                    <Button variant = 'contained' onClick={() => handleRedirect(resource)}>
                                                        {
                                                        /* Should be a View Ratings Page if you are the Author*/
                                                        resource.author.id == user.id ? 'View Ratings' : 'Rate It'
                                                        }
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <iframe src={resource.resource}/>
                                            <Box style = {{display:'flex'}}>
                                                <PersonIcon/>
                                                <Typography variant = 'body2'>
                                                    {resource.author.id == user.id? 'Me' : resource.author.first_name + " " + resource.author.last_name}</Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions style = {{justifyContent: 'center'}}>
                                            <Button variant ='contained' onClick = {() => downloadFile(resource.resource)}>Download</Button>
                                        </CardActions>
                                        {/*</Stack>*/}
                                    </Card>
                                </ListItem>
                            )
                        })}
                    </List>
                <Typography variant = 'h6'>Upload a new Resource to the {module.name} module</Typography>
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