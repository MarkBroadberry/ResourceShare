import { useNavigate } from "react-router-dom";
import myAxiosInstance from "../axios";
import { useContext, useEffect } from "react";
//import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { Context } from "./App";

export default function Logout(){
        const navigate = useNavigate();
        const [isAuthorized, setIsAuthorized] = useContext(Context);
    useEffect(() =>{
        const logout = async () => {
        try {
            /*
            const baseURL = 'http://localhost:8000/api/';

            const myNewestAxiosInstance = axios.create({
                baseURL: baseURL,
                timeout: 7500,
                headers:{
                    Authorization: localStorage.getItem("accessToken") ? 'Bearer ' + localStorage.getItem("accessToken")
                    : null,
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
            });
            
            let decodedToken = jwtDecode(localStorage.getItem("accessToken"));
        
            // Check if the token is not expired
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token has expired
            console.log("access token expired")}
            else{
                console.log("access token valid")
            }
            decodedToken = jwtDecode(localStorage.getItem("refreshToken"));
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                // Token has expired
                console.log("refresh token expired")}
            else{
                    console.log("refresh token valid")
            }*/

            console.log("Refresh Token", localStorage.getItem("refreshToken"));
            const response = await myAxiosInstance.post('logout/', {refresh_token : localStorage.getItem("refreshToken") });
            console.log("blacklisted");
            //console.log(response.data);
            localStorage.clear();
            myAxiosInstance.defaults.headers['Authorization']= null;
            setIsAuthorized(false);
            navigate("/login");
        } catch(error){
            console.error("Failure in Logout:", error)
        }
    };
    logout();
}, [navigate]);

    return(
        <div className = "StorageInfoTest"> logging out </div>
    );
}