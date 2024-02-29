import {React, useState, useEffect} from 'react';
import {Button, Stack, Box, Typography, Card, CardContent, CardActions , Paper} from "@mui/material";
import myAxiosInstance from '../axios';
import { TextField} from "@material-ui/core";
import '../../static/css/index.css';
import { useNavigate } from "react-router-dom";
import ModuleSearch from './subComponents/ModuleSearch';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import CircularProgress from '@mui/material/CircularProgress';


export default function Homepage(){

    const navigate = useNavigate();

    const [moduleName, setModuleName] = useState("");
    const [user, setUser] = useState({});
    const [university, setUniversity] = useState({});
    const [userModules, setUserModules] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const [isLoadingEnrolledData, setIsLoadingEnrolled] = useState(true);
    


    // for Carousel component - defines how many modules are shown in the module component for diff resoultions. 
    const responsive = {
        LargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 6
        },
        Desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 5
        },
        Tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 4
        },
        Mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 3
        }
      };

    

    const AddModuleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit(moduleName)
    };
    useEffect(()=>{
        myAxiosInstance.get('getUniversity/').then((response) =>{
            console.log(response.data)
            setUniversity(response.data);
            console.log()
        })
        .catch((error) =>{
            console.error("error fetching data: ", error);
        });

        myAxiosInstance.get('getUserDetail/').then((response) =>{
            console.log(response.data)
            setUser(response.data);
            setIsLoadingUserData(false);
        })
        .catch((error) =>{
            console.error("error fetching data: ", error);
            setIsLoadingUserData(false);
        });

        myAxiosInstance.get('listModules/currentUser/').then((response) =>{
            console.log(response.data)
            setUserModules(response.data)
            setIsLoading(false);
        })
        .catch((error) =>{
            console.error("error fetching data: ", error);
            setIsLoading(false);
        });

        

        myAxiosInstance.get("listModules/").then((response) =>{
            console.log("Module List ", response.data)  
            setModuleList(response.data);
            setIsLoadingEnrolled(false);
        }).catch((error)=>{
            console.log("error occured fetching modules: ", error)
            setIsLoadingEnrolled(false);
        });
    }, []);

    //user id needs to be wrapped in an array because of the many to many relationship between Module and Users.
    function handleSubmit(){
       myAxiosInstance.post('createModule/', {name: moduleName,  university: university.id, students: [user.id]}).then((response)=>{
        console.log(response.data)
        setModuleName("");
       })
    }

    const handleRedirect = (chosenModule) => navigate('/ModuleResources',{state: chosenModule/*{id: chosenModule.id, name: chosenModule.name}*/})

    return(
        <Box sx = {{height: '200vh', display: 'flex', paddingTop: '4.5%'}}>
            <Card sx = {{height: '200vh', width: '15%', marginLeft: '0', backgroundColor: '#669ef2' }}> 
                {isLoadingUserData?( 
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                ):(
                    <Paper  sx = {{width: '90%', marginLeft: '5%', marginTop: '5%'}}elevation={2}>
                        <Typography sx = {{fontWeight: 'bold'}}><PersonIcon fontSize='inherit'/> {user.first_name} {user.last_name}</Typography>
                        <Typography sx = {{fontWeight: 'bold'}}><SchoolIcon fontSize= 'inherit'/> {university.name}</Typography>
                        <Box sx = {{display: 'flex', alignItems: 'center'}}>
                            <GppGoodIcon fontSize='inherit'/> <Typography variant = "h7">{user.trust_rating}</Typography>
                        </Box>
                    </Paper>
                )}
            </Card>
                
            <Box sx = {{width : '85%'}}>
                <Box /*Module Section*/ sx = {{display: 'block', marginTop: '2%', marginLeft:'2%'}}>
                    
                        <Typography variant = "h4" sx = {{ marginLeft: '30%', fontFamily: 'Montserrat, sans-serif'}}>My Courses</Typography>
                    <Box sx = {{display: 'flex'}}>
                        
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <CircularProgress />
                                </Box>
                        ):
                        (
                        <>
                            {userModules.length=== 0 && (
                                <Typography variant = 'h4'>
                                    You are not enrolled in any Modules Yet!
                                </Typography>)
                            }
                            <Carousel responsive = {responsive} containerClass='carousel-container' itemClass = 'moduleCarouselItem' partialVisible = 'false' >
                            
                                {userModules.map(function(module, i){
                                    return (
                                        <Box key = {i} sx = {{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                            <Card sx = {{width: '100%', overflowX: 'auto'}}>    
                                                <CardContent sx = {{height: '60%'}}>
                                                    <Typography sx = {{fontSize: 14}} color = "text.secondary">
                                                        Module
                                                    </Typography>
                                                    <Typography variant = "h6" sx = {{overflowX: 'auto'}}>
                                                        {module.name} 
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button sx = {{height : '20%'}} size = 'small' variant = 'contained' onClick={() => handleRedirect(module)}>
                                                        See Resources
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Box>)
                                })}
                        
                            </Carousel>
                        </>
                        )}
                        
                    
                        <Paper elevation = {2} sx = {{marginLeft: '3%', marginTop: '3%', textAlign: 'center', height: '90%', border: 1}}>
                            <form onSubmit = {AddModuleFormSubmit}>
                                <Typography sx = {{fontWeight: 'bold'}}>Can't Find Your Modules? Add One!</Typography>
                                <TextField
                                label = "Type your Module Name"
                                value = {moduleName}
                                onChange = {(e)=> setModuleName(e.target.value)} ></TextField>
                                <Button sx= {{ width: '20%', marginLeft: '20%' ,marginTop:'5%'}}variant='contained' type = "submit">Add</Button>
                            </form>
                        </Paper>
                    </Box>
                </Box>

                <Box /*Module Search*/sx = {{width: '65%', marginTop : '7%', marginLeft: '3%', marginBottom: '40%'}}>
                    <Typography variant = 'h4' sx = {{marginLeft: '30%', marginBottom: '2%'}}> Enroll Into a Module </Typography>
                    {isLoadingEnrolledData?(
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <CircularProgress />
                        </Box>
                    ):(
                            <ModuleSearch height = '35%'dataList={moduleList} enrolledModules={userModules.map(module => module.id)}></ModuleSearch>
                    )
                    }
                </Box>
            

                
            </Box>
            <Box sx = {{height: '20%'}}> 

            </Box>
        </Box>

    );
}