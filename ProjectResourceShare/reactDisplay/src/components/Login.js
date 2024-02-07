import { TextField, Typography } from "@material-ui/core";
import Stack from '@mui/material/Stack';
import React, { Component, useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import myAxiosInstance from '../axios'
import { useNavigate } from "react-router-dom";
import css from '../../static/css/index.css';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
//import './App.css';
import { Context } from "./App";



export default function Login(){

    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useContext(Context);

    const formSubmit = (event) => {
        event.preventDefault();
        handleSubmit(email,password);
    }

    function handleSubmit(email, password){
        myAxiosInstance.post('token/', 
        {email, password}).then((response) => {
            console.log("posted");
            //console.log(response.data);
            localStorage.setItem('accessToken', response.data['access']);
            localStorage.setItem('refreshToken', response.data['refresh']);
            localStorage.setItem('user', response.data['user']);
            myAxiosInstance.defaults.headers['Authorization']='Bearer ' + localStorage.getItem('accessToken');
            setIsAuthorized(true);
            navigate("/home");
        })
        .catch((error) => {
            console.error("Failed Login: ", error);
            setLoginError("Incorrect Email or Password. Please Try Again.");
        });
            //navigate("/home");
    }
    


    return(
        <>
            <div>        
                <div className = "CenterForm">
                    <h1 className = "LoginTitle">Login</h1>
                    <form onSubmit={formSubmit}>
                    <Stack spacing = {2}>
                        <TextField 
                            id = "email"
                            label = "Email Address"
                            name = "email"
                            value = {email}
                            onChange = {(e)=> setEmail(e.target.value)}
                            //sets the email to the value entered by the user (through capturing the input event.)
                            //dynamically updates with the use state soundtrack.
                        />
                        <TextField
                            id = "password"
                            label = "Password"
                            name = "password"
                            type = "password"
                            value = {password}
                            onChange = {(e)=> setPassword(e.target.value)}
                            />
                
                        <Button
                            type = "submit"
                            className = "LoginButton">
                            Login
                        </Button>
                    </Stack>

                    </form>
                        {/*Conditionally Renders if there is an error - uses React hooks to do so */}
                        {loginError && (
                            <Alert severity="error">{loginError}</Alert>
                        )}
                </div>
                <p className = "RegisterMessage">Don't have an account? <a href = '/register'>Register Now</a></p>
            </div>
            
            
        </>

    );
}