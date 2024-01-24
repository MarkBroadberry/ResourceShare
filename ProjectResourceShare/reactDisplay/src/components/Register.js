import { TextField } from "@material-ui/core";
import React, { Component, useState } from 'react';
import Button from '@material-ui/core/Button';
import myAxiosInstance from '../axios'
import { useNavigate } from "react-router-dom";
import "../../static/css/index.css"
import Stack from '@mui/material/Stack';
import { ValidationError } from "webpack";
import Alert from '@mui/material/Alert';

export default function Register(){

    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [university, setUniversity] = useState("");

    const [universityNullError, setUniversityNullError] = useState(null)
    const [emailValidationError, setEmailValidationError] = useState(null)

    const formSubmit = (event) => {
        event.preventDefault();
        handleSubmit(email, password, first_name, last_name, university);
    }

    function handleSubmit(email, password, first_name, last_name, university){
        /*console.log("Email: ", email);
        console.log("Password ", password);*/
        myAxiosInstance.post( 'createUser/', 
        {email, password, first_name, last_name, university:{name: university}}).then((response) => {
            console.log(response);
            console.log("Redirecting");
            navigate("/login"); 
        })
        .catch((error) => {
            if (!university){
                setUniversityNullError("Please enter your University.")
            }
            if (error instanceof ValidationError){
                setEmailValidationError("Please enter a valid email address.")
            }

            console.error("Error during registration: ", error);
        });
    }
    
    return(
        <>
        <div className = "CenterForm">
            <h1 className = "LoginTitle">Sign Up</h1>
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
                        value = {password}
                        onChange = {(e)=> setPassword(e.target.value)}
                        />
                    <Stack direction = 'row' spacing={5}>
                        <TextField
                            id = "first_name"
                            label = "First Name"
                            name = "first_name"
                            value = {first_name}
                            onChange = {(e)=> setFirstName(e.target.value)}
                            />
                        <TextField
                        id = "last_name"
                        label = "Last Name"
                        name = "last_name"
                        value = {last_name}
                        onChange = {(e)=> setLastName(e.target.value)}
                        />
                    </Stack>
                    <TextField
                        id = "university"
                        label = "University"
                        name = "university"
                        value = {university}
                        onChange = {(e)=> setUniversity(e.target.value)}
                        />
                    <Button
                        type = "submit"
                        className = "LoginButton">
                        Sign Up
                    </Button>
                    {emailValidationError && (
                            <Alert severity="error">{emailValidationError}</Alert>
                        )}
                    {universityNullError && (
                        <Alert severity="error">{universityNullError}</Alert>
                    )}
                </Stack>
            </form>
        </div>
        <p className = "RegisterMessage">Already have an account? <a href = '/login'>Login Now</a></p>
        </>

    );
}