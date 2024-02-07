import { Button, Card, CardActionArea, CardContent, Typography, Stack, TextField, CardActions, Box} from '@mui/material'
import React, { useEffect, useState } from 'react'
import myAxiosInstance from '../../axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


function enroll(moduleId){
    myAxiosInstance.post(`enrollCurrentUser/module/${moduleId}/`).then((response) =>{
        console.log(response)
        console.log("enrolled successfully")
    })
    .catch((error)=>{
        console.log("error enrolling: ", error)
    })
}

export default function ModuleSearch({dataList, enrolledModules}) {
    const [searchValue,setSearchValue] = useState("");
   // const [userModuleIds, setUserModuleIds] = useState([]);

    const filteredModules = dataList.filter(module => {return (
        module.name.toLowerCase().includes(searchValue.toLowerCase()) 
    )} )

    
    /*const filteredModules = [{'name': "test1", 'university': "uOB"}, {'name': "test2", 'university': "uOB2"}]*/

    function searchList(){
        const displayFilter = filteredModules.map(function(module){
            return(
        <Card key = {module.id} sx={{ maxWidth: 450, display: 'flex'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: 350}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {module.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.university.name}
                </Typography>
              </CardContent>
            </Box>
            
            <CardActions style = {{ marginLeft: 'auto', display: 'flex', alignItems: 'center'}} >
                {!enrolledModules.includes(module.id) && (<Button variant = "contained" onClick = {() => enroll(module.id)}>
                    Enroll
                </Button>)}
                {enrolledModules.includes(module.id) && (<div className = "EnrolledCheck">
                    Enrolled 
                    <CheckCircleOutlineIcon sx = {{color: 'white'}}></CheckCircleOutlineIcon> 
                </div>)}
                
            </CardActions>
            
            
          </Card>)})

          return(
            <Stack spacing = {2}>
                {displayFilter}
            </Stack>
          )

    }
  return (
    <div>

        <TextField
        label = "Search existing Modules"
        value = {searchValue}
        onChange = {(e)=> setSearchValue(e.target.value)}
        >
        </TextField>

        <div>
            {searchList()}
        </div>
    </div>
  )
}
