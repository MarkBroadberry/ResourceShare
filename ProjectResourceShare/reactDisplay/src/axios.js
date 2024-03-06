import axios from 'axios';
const baseURL = 'http://localhost:8000/api/';
console.log("axios instance, access: ", localStorage.getItem("accessToken"));

const myAxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers:{
        Authorization : localStorage.getItem("accessToken") ? "Bearer " + localStorage.getItem("accessToken") : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

/*
INTERCEPTOR TO INTERCEPT REQUEST AND UPDATE THE AUTHORIZATION WHEN THE REQUEST IS SENT. AS OPPOSED TO AT INITALIZATION
UNNECESSARY - WAS AN ERROR IN LOGIN GETTING THE ACCESS TOKEN. 

myAxiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken){
            config.headers.Authorization = 'Bearer ' + accessToken;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);*/


export default myAxiosInstance;