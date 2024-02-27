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
import downloadFile from './ModuleResources';
import CircularProgress from '@mui/material/CircularProgress';


export default function SavedResources(){
        const [SavedResources, setSavedResources] = useState([]);
        const [user, setUser] = useState({});
        const [isLoading, setIsLoading] = useState(true);

        const location = useLocation();
        const navigate = useNavigate();

        let module = location.state;
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

        return (
            <>
                <Typography variant = "h3" sx = {{marginTop: '7%'}}>Saved Resources</Typography>
                    {isLoading ?(
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                    ) : (
                    <List component = {Stack} spacing = {2} direction = "row" style = {{overflow: 'auto'}}>
                        {SavedResources.map(function(savedResource){
                            return(
                                <ListItem key = {savedResource.id} sx = {{maxWidth: '33%'}}>
                                    <Card sx = {{width: '100%', height: '100%'}} key = {savedResource.id}>
                                        <CardContent>
                                            <Box style = {{display:'flex', marginBottom: '2%', justifyContent: 'center'}}>
                                                <FilePresentIcon/>
                                                <Typography>{savedResource.resource.name}</Typography>
                                                <Box style = {{marginLeft : 'auto'}}>
                                                    <Button variant = 'contained' onClick={() => handleRedirect(savedResource.resource.resource)} style = {{fontSize: '0.6rem'}}>
                                                        {
                                                        /* Should be a View Ratings Page if you are the Author*/
                                                        savedResource.resource.author.id == user.id ? 'View Ratings' : 'Rate It'
                                                        }
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <iframe src={savedResource.resource.resource}/>
                                            <Stack direction = "row" alignItems= "center" spacing={1}>
                                                <PersonIcon/>
                                                <Typography variant = 'body2'>
                                                    {savedResource.resource.author.id == user.id? 'Me' : savedResource.resource.author.first_name + " " + savedResource.resource.author.last_name}</Typography>
                                            </Stack>
                                            <Stack  direction = "row" alignItems= "center" spacing={1}>
                                                <GppGoodIcon/> 
                                                <Typography variant = 'body2'>{savedResource.resource.author.trust_rating} </Typography> 
                                            </Stack> 
                                        </CardContent>
                                        <CardActions style = {{justifyContent: 'center'}}>
                                            <Button variant ='contained' onClick = {() => downloadFile(savedResource.resource.resource)}>Download</Button>
                                        </CardActions>
                                        {/*</Stack>*/}
                                    </Card>
                                </ListItem>
                            )
                        })}
                    </List> 
                    )
                    
                
                }
                                   
            </>
            
        );
}