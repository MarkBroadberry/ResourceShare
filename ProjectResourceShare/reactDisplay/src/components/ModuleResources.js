import React, { Component, useEffect } from 'react';
import {useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import myAxiosInstance from '../axios';
import { Button, TextField, Card, CardContent, CardActions, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Divider } from '@mui/material';
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
//import Other from '../../static/frontend/Other.jpg';
import CircularProgress from '@mui/material/CircularProgress';


//Images
export const typeImages = {
    LectureNotes: { image: '../../static/images/LectureNotes.jpg', type: 'Lecture Notes' },
    Essay: { image: '../../static/images/Essay.jpg', type: 'Essay' },
    Code: { image: '../../static/images/Code.jpg', type: 'Code' },
    Presentation: { image: '../../static/images/Presentation.jpg', type: 'Presentation' },
    FlashCards: { image: '../../static/images/FlashCards.jpg', type: 'Flash Cards' },
    Spreadsheet: { image: '../../static/images/Spreadsheet.jpg', type: 'Spreadsheet' },
    Graph: { image: '../../static/images/Graph.jpg', type: 'Graph' },
    Diagram: { image: '../../static/images/Diagram.jpg', type: 'Diagram' },
    Image: { image: '../../static/images/Image.jpg', type: 'Image' },
    PastPaper: { image: '../../static/images/PastPaper.jpg', type: 'Past Paper' },
    ExamMarkScheme: { image: '../../static/images/ExamMarkScheme.jpg', type: 'Exam Mark Scheme' },
    RevisionNotes: { image: '../../static/images/RevisionNotes.jpg', type: 'Revision Notes' },
    Report: { image: '../../static/images/Report.jpg', type: 'Report' },
    Article: { image: '../../static/images/Article.jpg', type: 'Article' },
    Other: { image: '../../static/images/Other.jpg', type: 'Other' }
};

export default function ModuleResources(){
        const [fileName, setFileName] = useState("");
        const [file, setFile] = useState([]);
        const [fileDescription, setFileDescription] = useState("");
        const [user, setUser] = useState({});
        const [fileResetKey, setFileResetKey] = useState(0);
        const [resources, setResources] = useState([]);
        const [iconClickedList, setIconClickedList] = useState([]);
        const [savedResources, setSavedResources] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [type, setType] = useState("");



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
                setIsLoading(false);
                
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
                formData.append('type', type);
                console.log("form data appended", user.id, module.id)

                myAxiosInstance.post('resourceUpload/', formData, {
                headers: headers
              })
                .then((response) => {
                    setFile([]);
                    setFileDescription("");
                    setFileName("");
                    setType("");
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

        const handleTypeChange = (e) => {
                setType(e.target.value);
        };
        
        return (
            <>
                <div className='ModuleResourceTitles'>
                    <h1>{module.name}</h1>
                </div>

                <h3>Resources for this Module</h3>
                {isLoading ?( 
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                ):(
                    resources.length === 0 ? (
                        <Typography variant = 'h4'>
                           Be the first to upload a resource for this module!
                        </Typography>)
                    : (
                    <Carousel responsive={responsive} containerClass='carousel-container' itemClass='resourceCarouselItem' partialVisible='false'>
                        {resources.map(function(resource){
                            return(
                                    <Card sx = {{width: '100%', height: '100%'}} key = {resource.id}>
                                        <CardContent sx = {{paddingBottom: '0'}}>
                                            <Box style = {{display:'flex', marginBottom: '2%', justifyContent: 'center', height: '15%', overflowX: 'auto'}}>
                                                <FilePresentIcon/>
                                                <Typography sx = {{width: '70%', overflowX: 'auto', fontWeight: 'bold'}}>{resource.name}</Typography>
                                                <Box style = {{marginLeft : 'auto'}}>
                                                    <Button variant = 'contained' onClick={() => handleRedirect(resource)} style = {{fontSize: '0.6rem'}}>
                                                        {
                                                        /* Should be a View Ratings Page if you are the Author*/
                                                        resource.author.id === user.id ? 'View Ratings' : 'Rate It'
                                                        }
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <img src = {typeImages[resource.type].image} className='resourceImage'/>
                                            <Typography sx = {{fontSize: 14}} color = "text.secondary">{typeImages[resource.type].type}</Typography>
                                            <Divider/>

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
                                                    {/* you cant save your own resources, for the sake of the trust mechanism */}
                                                    {
                                                    resource.author.id != user.id &&
                                                        (iconClickedList.includes(resource.id) || savedResources.includes(resource.id)? (
                                                            <BookmarkIcon sx = {{fontSize: '3rem'}} onClick = {() => handleUnsaveClick(resource)}/>
                                                          ) : (
                                                            <BookmarkBorderIcon sx = {{fontSize: '3rem'}} onClick={() => handleIconClick(resource)}/>
                                                            )
                                                        )
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
                ))} 
                  
                <Paper elevation = {2} sx = {{marginBottom: '20%', width: '40%', marginLeft: '30%', marginTop: '4%'}}>
                    <Typography variant = 'h6' sx = {{textAlign: 'center'}}>Upload a new Resource to the {module.name} module</Typography>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Box sx = {{display: 'flex'}}>
                            <TextField 
                            sx = {{marginRight: '2%', marginLeft: '3%'}}
                            label = "File Name"
                            value = {fileName}
                            onChange={(e)=> setFileName(e.target.value)}/>
                            <TextField
                            label = "File Description"
                            value = {fileDescription}
                            onChange={(e)=> setFileDescription(e.target.value)}/>
                        </Box>
                        <Box sx = {{display: 'block'}}>
                            <TextField
                            type = "file"
                            onChange={handleFileChange}
                            key = {fileResetKey}
                            sx ={{marginLeft: '13%', marginTop: '2%'}}/>
                            <Box sx = {{marginLeft:'30%'}}>
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel>Resource Type</InputLabel>
                                    <Select
                                    labelId="typeHelperLabel"
                                    id="resourceTypeSelect"
                                    value={type}
                                    label="Resource Type"
                                    onChange={handleTypeChange}
                                    >
                                    <MenuItem value = {'LectureNotes'}>Lecture Notes</MenuItem>
                                    <MenuItem value = {'Essay'}>Essay</MenuItem>
                                    <MenuItem value = {'Code'}>Code</MenuItem>
                                    <MenuItem value = {'Presentation'}>Presentation</MenuItem>
                                    <MenuItem value = {'FlashCards'}>Flash Cards</MenuItem>
                                    <MenuItem value = {'Spreadsheet'}>Spreadsheet</MenuItem>
                                    <MenuItem value = {'Graph'}>Graph</MenuItem>
                                    <MenuItem value = {'Diagram'}>Diagram</MenuItem>
                                    <MenuItem value = {'Image'}>Image</MenuItem>
                                    <MenuItem value = {'PastPaper'}>Past Paper</MenuItem>
                                    <MenuItem value = {'ExamMarkScheme'}>Exam Mark Scheme</MenuItem>
                                    <MenuItem value = {'RevisionNotes'}>Revision Notes</MenuItem>
                                    <MenuItem value = {'Report'}>Report</MenuItem>
                                    <MenuItem value = {'Article'}>Article</MenuItem>
                                    <MenuItem value = {'Other'}>Other</MenuItem>

                                    </Select>
                                    <FormHelperText>What are you sharing?</FormHelperText>
                                </FormControl>
                            </Box>
                            <Button variant = "contained" type = "submit" value = "Submit" sx = {{width: '20%', marginLeft: '40%', marginTop: '2%', marginBottom: '2%'}}>Submit</Button>
                        </Box>
                    </form>
                </Paper>
                
            </>
            
        );
}