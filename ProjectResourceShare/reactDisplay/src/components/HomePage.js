import {React, useState, useEffect} from 'react';
import Button from "@mui/material/Button";
import myAxiosInstance from '../axios';
import { TextField} from "@material-ui/core";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import css from '../../static/css/index.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


export default function Homepage(){

    const navigate = useNavigate();

    const [moduleName, setModuleName] = useState("")
    const [user, setUser] = useState({});
    const [university, setUniversity] = useState({})
    const [modules, setModules] = useState([])

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

    myAxiosInstance.get('listModules/').then((response) =>{
        console.log(response.data)
        setModules(response.data)
        
    })
    .catch((error) =>{
        console.error("error fetching data: ", error);
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
        <div className = "UserInfo">
            <Stack spacing = {1}> 
                <h3>{user.first_name} {user.last_name}</h3>
                <h4>{university.name}</h4>
            </Stack>
            <h2> My Courses</h2>
            <div className = "ModuleList">
                <List component = {Stack} direction = "row">
                    {modules.map(function(module, i){
                        return <ListItem key={i}>{module.name} 
                            <Button onClick={() => handleRedirect(module)}>
                                See File Resources
                            </Button>
                        </ListItem>
                    })}
                </List>
            </div>

            <form onSubmit = {AddModuleFormSubmit}>
                <TextField
                label = "ModuleName"
                value = {moduleName}
                onChange = {(e)=> setModuleName(e.target.value)} >Add a Module</TextField>
                <Button variant='contained' type = "submit">Add</Button>
            </form>
        </div>
    );
}