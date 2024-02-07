import {React, useState, useEffect} from 'react';
import {Button, List, ListItem, Stack, Box, Typography} from "@mui/material";
import myAxiosInstance from '../axios';
import { TextField} from "@material-ui/core";
import css from '../../static/css/index.css';
import { useNavigate } from "react-router-dom";
import ModuleSearch from './subComponents/ModuleSearch';


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
                    <h3>{user.first_name} {user.last_name}</h3>
                    <h4>{university.name}</h4>
                </Stack>
            </div>
            <Typography variant = "h3">My Courses</Typography>
        <Box /*Module Section*/ sx = {{display: 'flex', width: '100%'}}>
            <Box /*Module List*/ sx = {{width: '45%', height: '50%', marginRight: '2%'}}>
                <div className = "ModuleList">
                    {userModules.length=== 0 && (
                        <div>
                            You are not enrolled in any Modules Yet!
                        </div>)}
                    <List component = {Stack} direction = "row" spacing = {2}>
                        {userModules.map(function(module, i){
                            return (<Stack key = {i} direction = "column" spacing = {2} className = "DisplayedModule" width={1000}>    
                                        <ListItem className = "ModuleItem">
                                            <Typography className = "DisplayedModuleTitle">
                                                {module.name} 
                                            </Typography>
                                        </ListItem>
                                        <ListItem>        
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%' }}>
                                                <Button color = 'secondary' size = 'small' variant = 'contained' onClick={() => handleRedirect(module)}>
                                                    See Resources
                                                </Button>
                                            </Box>
                                        </ListItem>
                                    </Stack>)
                        })}
                    </List>
                </div>
            </Box>
            <Box /*Module Search*/sx = {{width: '50%', maxHeight: 300, overflowY :'auto', border: 2, borderColor: 'gray', borderRadius: '10px'}}>
                <h4 className = "SearchTitle"> Enroll Into a Module </h4>
                <ModuleSearch dataList={moduleList} enrolledModules={userModules.map(module => module.id)}></ModuleSearch>
            </Box>
        </Box>
        

            <form onSubmit = {AddModuleFormSubmit}>
                <div>Add a New Module</div>
                <TextField
                label = "ModuleName"
                value = {moduleName}
                onChange = {(e)=> setModuleName(e.target.value)} ></TextField>
                <Button variant='contained' type = "submit">Add</Button>
            </form>
        </div>

    );
}