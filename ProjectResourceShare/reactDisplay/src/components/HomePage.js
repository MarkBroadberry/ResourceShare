import {React, useState, useEffect} from 'react';
import {Button, Stack, Box, Typography, Card, CardContent, CardActions} from "@mui/material";
import myAxiosInstance from '../axios';
import { TextField} from "@material-ui/core";
import css from '../../static/css/index.css';
import { useNavigate } from "react-router-dom";
import ModuleSearch from './subComponents/ModuleSearch';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';



export default function Homepage(){

    const navigate = useNavigate();

    const [moduleName, setModuleName] = useState("");
    const [user, setUser] = useState({});
    const [university, setUniversity] = useState({});
    const [userModules, setUserModules] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    

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
        })
        .catch((error) =>{
            console.error("error fetching data: ", error);
        });

        myAxiosInstance.get('listModules/currentUser/').then((response) =>{
            console.log(response.data)
            setUserModules(response.data)
            
            
        })
        .catch((error) =>{
            console.error("error fetching data: ", error);
        });

        

        myAxiosInstance.get("listModules/").then((response) =>{
            console.log("Module List ", response.data)  
            setModuleList(response.data);
        }).catch((error)=>{
            console.log("error occured fetching modules: ", error)
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
        <div className = "Container">
            <div className = "UserInfo">
                <Stack spacing = {1}> 
                    <h3><PersonIcon/> {user.first_name} {user.last_name}</h3>
                    <h4><SchoolIcon/> {university.name}</h4>
                    <Box sx = {{display: 'flex'}}>
                        <GppGoodIcon/> {user.trust_rating}
                    </Box>
                </Stack>
            </div>
            <Typography variant = "h3">My Courses</Typography>
        <Box /*Module Section*/ sx = {{display: 'flex', width: '100%'}}>
            <Stack direction = "row" spacing = {2} sx = {{width: "45%", overflow: "auto"}}>
                {userModules.length=== 0 && (
                <Typography>
                    You are not enrolled in any Modules Yet!
                </Typography>)}

                {userModules.map(function(module, i){
                    return (
                        <Box key = {i} sx = {{minWidth: '20%', minHeight: '90%'}}>
                            <Card sx = {{width: '100%', overflowX: 'auto'}}>    
                                <CardContent sx = {{height: '60%'}}>
                                    <Typography sx = {{fontSize: 14}} color = "text.secondary">
                                        Module
                                    </Typography>
                                    <Typography variant = "h6">
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
            </Stack>

            <Box /*Module Search*/sx = {{width: '50%', height: 250, overflowY :'auto', border: 2, borderColor: 'gray', borderRadius: '10px'}}>
                <h4 className = "SearchTitle"> Enroll Into a Module </h4>
                <ModuleSearch dataList={moduleList} enrolledModules={userModules.map(module => module.id)}></ModuleSearch>
            </Box>
        </Box>
        

            <form onSubmit = {AddModuleFormSubmit}>
                <div>Can't Find Your Modules? Add One!</div>
                <TextField
                label = "Type your Module Name"
                value = {moduleName}
                onChange = {(e)=> setModuleName(e.target.value)} ></TextField>
                <Button variant='contained' type = "submit">Add</Button>
            </form>
        </div>

    );
}