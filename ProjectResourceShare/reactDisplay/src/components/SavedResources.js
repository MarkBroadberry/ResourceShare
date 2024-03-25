import React, { Component, useEffect } from 'react';
import {useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import myAxiosInstance from '../axios';
import { Button, TextField, Card, CardContent, CardActions, Typography, Box, Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import fileDownload from 'js-file-download';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PersonIcon from '@mui/icons-material/Person';
import GppGoodIcon from '@mui/icons-material/GppGood';
import downloadFile from './ModuleResources';
import CircularProgress from '@mui/material/CircularProgress';
import Carousel from 'react-multi-carousel';
import '../../static/css/index.css';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {typeImages} from './ModuleResources';




export default function SavedResources(){
        const [SavedResources, setSavedResources] = useState([]);
        const [user, setUser] = useState({});
        const [isLoading, setIsLoading] = useState(true);
        //ids of reasources with the saved icon active - starts as all resources for obvious reasons.
        const [savedIconActiveResources, setsavedIconActiveResources] = useState([]);

        const location = useLocation();
        const navigate = useNavigate();

        let module = location.state;

        const responsive = {
            LargeDesktop: {
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

        useEffect(()=>{
            console.log(typeImages.LectureNotes);
        })

        useEffect(() => {
            myAxiosInstance.get('getUserDetail/').then((response) =>{
                setUser(response.data);
                setIsLoading(false);
                console.log("user data: ", response.data);
                console.log("user: ", user);
                console.log("user id: ", user.id);
            })
            .catch((error) =>{
                console.log("error fetching user data: ", error);
                setIsLoading(false);
            });


            },[user.id] );


        useEffect(() =>{
             if(user.id){
                console.log("fetching saved resources")
                myAxiosInstance.get(`SavedResources/${user.id}/`).then((response) =>{
                    console.log("fetched SR:", response.data)
                    setSavedResources(response.data)
                    for(let i = 0; i < response.data.length; i++){
                        setsavedIconActiveResources(prev => [...prev, response.data[i].resource.id]);
                    }
                    setIsLoading(false);
                    
                })
                .catch((error) =>{
                    console.log("error fetching user data: ", error);
                    setIsLoading(false);
                });
            }
        }, [user.id])


        useEffect(() =>{
             console.log("saved resources", SavedResources)
        }, [SavedResources])

        const handleRedirect = (chosenResource) => navigate('/ResourceRatings',{state: chosenResource});

        const handleIconClick = (resource) =>{
            let resourceId = resource.id
            setsavedIconActiveResources(prev => [...prev, resourceId]);
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
            setsavedIconActiveResources(savedIconActiveResources.filter((id) => id !== resourceId));
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
            <Box sx = {{marginBottom: '10%'}}>
                <Typography variant = "h3" sx = {{marginTop: '7%'}}>Saved Resources</Typography>
                    {isLoading ?(
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                    ) : (
                        <Carousel responsive={responsive} containerClass='carousel-container' itemClass='carousel-item' partialVisible='false'>
                        {SavedResources.map(function(savedResource){
                            return(
                                    <Card sx = {{width: '100%', height: '100%'}} key = {savedResource.id}>
                                        <CardContent>
                                            <Box style = {{display:'flex', marginBottom: '2%', justifyContent: 'center', height: '15%', overflowX: 'auto'}}>
                                                <FilePresentIcon/>
                                                <Typography sx = {{width: '70%', overflowX: 'auto', fontWeight: 'bold'}}>{savedResource.resource.name}</Typography>
                                                <Box style = {{marginLeft : 'auto'}}>
                                                    <Button variant = 'contained' onClick={() => handleRedirect(savedResource.resource.resource)} style = {{fontSize: '0.6rem'}}>
                                                        {
                                                        /* Should be a View Ratings Page if you are the Author*/
                                                        savedResource.resource.author.id === user.id ? 'View Ratings' : 'Rate It'
                                                        }
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <img src={typeImages[savedResource.resource.type].image} className='resourceImage'/>
                                            <Typography sx = {{fontSize: 14}} color = "text.secondary">{typeImages[savedResource.resource.type].type}</Typography>
                                            <Divider/>
                                            <Box sx = {{display: 'flex' ,justifyContent: 'space-between'}}>
                                                <Box>
                                                    <Stack direction = "row" alignItems= "center" spacing={1}>
                                                        <PersonIcon/>
                                                        <Typography variant = 'body2'>
                                                            {savedResource.resource.author.id == user.id? 'Me' : savedResource.resource.author.first_name + " " + savedResource.resource.author.last_name}</Typography>
                                                    </Stack>
                                                    <Stack  direction = "row" alignItems= "center" spacing={1}>
                                                        <GppGoodIcon/> 
                                                        <Typography variant = 'body2'>{savedResource.resource.author.trust_rating} </Typography> 
                                                    </Stack> 
                                                </Box>
                                                <Box>
                                
                                                    {
                                                        (savedIconActiveResources.includes(savedResource.resource.id)? (
                                                            <BookmarkIcon sx = {{fontSize: '3rem'}} onClick = {() => handleUnsaveClick(savedResource.resource)}/>
                                                          ) : (
                                                            <BookmarkBorderIcon sx = {{fontSize: '3rem'}} onClick={() => handleIconClick(savedResource.resource)}/>
                                                            )
                                                        )
                                                    }
                                                   
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardActions style = {{justifyContent: 'center'}}>
                                            <Button variant ='contained' onClick = {() => downloadFile(savedResource.resource.resource)}>Download</Button>
                                        </CardActions>
                                    </Card>
                            )
                        })}
                        </Carousel>
                    
                    )
                    
                    
                
                }
                                   
            </Box>
            
        );
}