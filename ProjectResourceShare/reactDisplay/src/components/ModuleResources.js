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
import GppGoodIcon from '@mui/icons-material/GppGood';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Carousel from 'react-multi-carousel';
import '../../static/css/index.css';


export default function ModuleResources(){
        const [fileName, setFileName] = useState("");
        const [file, setFile] = useState([]);
        const [fileDescription, setFileDescription] = useState("");
        const [user, setUser] = useState({});
        const [fileResetKey, setFileResetKey] = useState(0);
        const [resources, setResources] = useState([]);
        const [iconClickedList, setIconClickedList] = useState([]);
        const [savedResources, setSavedResources] = useState([]);
        //const [ratings, setRatings] = useState([]);
        //const [userRatedResources, setUserRatedResources] = useState([]);


        const responsive = {
            LargeDesktop: {
              // the naming can be any, depends on you.
              breakpoint: { max: 4000, min: 3000 },
              items: 5
            },
            Desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 4
            },
            Tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 3
            },
            Mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 3
            }
          };

        
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



        useEffect(()=>{
            if(user.id){
                myAxiosInstance.get(`SavedResources/${user.id}/`).then((response) =>{
                    console.log("Saved Resources: ", response.data)  
                    for(let i = 0; i < response.data.length; i++){
                            setSavedResources(prev => [...prev, response.data[i].resource.id]);
                    }
                    //setSavedResources(response.data)
                    console.log("just ids list: ", savedResources);
                }).catch((error)=>{
                    console.log("error occured fetching saved resources: ", error)
                });
            }
        }, [user.id])

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

        const handleIconClick = (resource) =>{
            let resourceId = resource.id
            setIconClickedList(prev => [...prev, resourceId]);
            myAxiosInstance.post(`createSavedResource/`, {user: user.id, resource: resourceId}).then((response) =>{
                console.log("saved resource: ", response.data);
            })
            .catch((error) =>{
                console.error("error setting saved resource: ", error);
            });     
            myAxiosInstance.post(`createTrustRelationship/`, {trustor: user.id, trustee: resource.author.id, weight: 4, type: 'Saved', relatedResource: resourceId}).then((response) =>{
                console.log("Create Resource: ", response.data);
            })
            .catch((error) =>{
                console.error("error setting saved resource: ", error);
            });              
        }

        const handleUnsaveClick = (resource) =>{
            let resourceId = resource.id
            setIconClickedList(iconClickedList.filter((id) => id !== resourceId));
            setSavedResources(savedResources.filter((id) => id !== resourceId));
            myAxiosInstance.post(`unsaveResource/`, {user: user.id, resource: resourceId}).then((response) =>{
                console.log("unsaved resource: ", response);
            })
            .catch((error) =>{
                console.error("error unsaving resource: ", error);
            }); 
            myAxiosInstance.post(`deleteTrustRelationship/`, {trustor: user.id, trustee: resource.author.id, weight: 4, type: 'Saved', relatedResource: resourceId}).then((response) =>{
                console.log("deleted trust relationship: ", response);
            })
            .catch((error) =>{
                console.error("error deleting trust relationship: ", error);
            });  

        }
        return (
            <>
                <div className='ModuleResourceTitles'>
                    <h1>{module.name}</h1>
                </div>

                <h3>Resources for this Module</h3>
                    <Carousel responsive={responsive} containerClass='carousel-container' itemClass='carousel-item'>
                        {resources.map(function(resource){
                            return(
                                    <Card sx = {{width: '100%', height: '100%'}} key = {resource.id}>
                                        <CardContent>
                                            <Box style = {{display:'flex', marginBottom: '2%', justifyContent: 'center'}}>
                                                <FilePresentIcon/>
                                                <Typography>{resource.name}</Typography>
                                                <Box style = {{marginLeft : 'auto'}}>
                                                    <Button variant = 'contained' onClick={() => handleRedirect(resource)} style = {{fontSize: '0.6rem'}}>
                                                        {
                                                        /* Should be a View Ratings Page if you are the Author*/
                                                        resource.author.id == user.id ? 'View Ratings' : 'Rate It'
                                                        }
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <iframe src={resource.resource}/>
                                            <Box sx = {{display: 'flex' ,justifyContent: 'space-between'}}>
                                                <Box>
                                                    <Stack direction = "row" alignItems= "center" spacing={1}>
                                                        <PersonIcon/>
                                                        <Typography variant = 'body2'>
                                                            {resource.author.id == user.id? 'Me' : resource.author.first_name + " " + resource.author.last_name}</Typography>
                                                    </Stack>
                                                    <Stack  direction = "row" alignItems= "center" spacing={1}>
                                                        <GppGoodIcon/> 
                                                        <Typography variant = 'body2'>{resource.author.trust_rating} </Typography> 
                                                    </Stack> 
                                                </Box>
                                                <Box>
                                                    {iconClickedList.includes(resource.id) || savedResources.includes(resource.id)? (
                                                         <BookmarkIcon sx = {{fontSize: '3rem'}} onClick = {() => handleUnsaveClick(resource)}/>
                                                    ):   <BookmarkBorderIcon sx = {{fontSize: '3rem'}} onClick={() => handleIconClick(resource)}/>
                                                    }
                                                   
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardActions style = {{justifyContent: 'center'}}>
                                            <Button variant ='contained' onClick = {() => downloadFile(resource.resource)}>Download</Button>
                                        </CardActions>
                                    </Card>
                            )
                        })}
                    </Carousel>
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