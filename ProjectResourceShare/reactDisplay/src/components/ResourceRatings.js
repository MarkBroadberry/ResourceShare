import { Box, Typography, Stack, Card, CardContent, CardActions, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import myAxiosInstance from '../axios';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PersonIcon from '@mui/icons-material/Person';
import Rating from '@mui/material/Rating';

export default function ResourceRatings() {

    //TODO - Change Rating Buttons so that if you authored the resource the button says view
    //And takes you to either the same or different page and lets you see the ratings for your things. 

    const [ratings, setRatings] = useState([]);
    const [newRating, setNewRating] = useState("");
    const [user, setUser] = useState({});
    const [ratingComment, setRatingComment] = useState("");
    const [userHasRated, setUserHasRated] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    let resource = location.state;
    if(!resource){
        return(<div>Loading...</div>)
    }
    console.log("resource", resource);
    
    useEffect(() => {
        console.log("resource id", resource.id)
        myAxiosInstance.get(`getRatings/${resource.id}`).then((response) =>{
            console.log("getRatings Response: ", response.data);
            setRatings(response.data);
        }).catch((error)=>{
            console.log("Error occured while fetching: ", error);
        })
        myAxiosInstance.get('getUserDetail/').then((response) =>{
            setUser(response.data);
            console.log("user id: ", user.id);
        })
        .catch((error) =>{
            console.log("error fetching user data: ", error);
        });
        }, [user.id, resource.id]);

    useEffect(()=>{
        for (let i = 0; i < ratings.length; i ++){
            if (ratings[i].author.id === user.id){
                setUserHasRated(true);
            }
        }
    },[ratings])

    const AddRatingRequest = () =>({
        'author': user.id,
        'rating': newRating,
        'resource': resource.id,
        'comment': ratingComment
    });

    const AddTrustRelationshipRequest = () => ({
        'trustor': user.id ,
        'trustee': resource.author.id,
        'weight': newRating,
        'type': 'Rating',
        'relatedResource':resource.id
    });

    const handleAddRating = async(e) => {
            e.preventDefault();
            try{
            const AddRatingRequestData = AddRatingRequest();
            myAxiosInstance.post(`createRating/`, AddRatingRequestData).then((response) => {
                console.log("response:", response);
                setNewRating("");
                setRatingComment("");
            })
            .catch((error)=>{
                console.log("Error adding rating: ", error);
            })

            const AddTrustRelationshipRequestData = AddTrustRelationshipRequest();
            myAxiosInstance.post(`createTrustRelationship/`, AddTrustRelationshipRequestData).then((response)=> {
                console.log("Trust Relationsip Create Response: ", response);
            }).catch((error)=>{
                console.log("Error adding Trust Relationship: ", error);
            })
        }catch(error){
            console.log("Create Rating error: ", e);
        }
    }
  return (
    <Box>
        <Box sx = {{height: '10%'}}></Box>
        <Typography variant = "h3">Ratings for {resource.name}</Typography>
        {/*If it's your resource and you are viewing, hide input and output view message*/
        (resource.author.id == user.id || userHasRated) ? (
            <Typography variant = "h4">View Other Students Ratings of <FilePresentIcon/>{resource.name}</Typography>
            ) : (
            <Box sx = {{marginTop: "2%"}}>
                {/*Form To Rate the Resource 
                This will be replaced with a stars rating input*/}
                <form onSubmit = {handleAddRating}>
                    <Typography>Rate This Resource</Typography>
                    <Rating
                     name="newRating"
                     defaultValue={0}
                     precision={0.5}
                     value = {newRating}
                     onChange = {(e)=> setNewRating(e.target.value)} />

                    
                    {/*
                    <TextField
                    id = "newRating"
                    label = "Your Rating"
                    name = "newRating"
                    value = {newRating}
                    onChange = {(e)=> setNewRating(e.target.value)}
                    />*/}

                    <TextField
                    id = "ratingComment"
                    label = "Your Comment"
                    name = "ratingComment"
                    value = {ratingComment}
                    onChange = {(e)=> setRatingComment(e.target.value)}
                    />

                    <Button variant = 'contained' type = "submit">Rate</Button>
                </form>
            </Box>
            )
        }

        <Stack spacing = {2} style = {{overflow: 'auto'}}>
            {ratings.map(function(rating){
                return(
                    <Card sx = {{width: '40%'}} key = {rating.id}>
                        <CardContent sx ={{display:'flex', justifyContent:'space-between'}}>
                            <Typography> <PersonIcon/>{rating.author.id == user.id ? "Me" : rating.author.first_name + " " + rating.author.last_name}</Typography>
                            {/*<Typography>{rating.rating}</Typography>*/}
                            <Rating name="viewedRating" value = {rating.rating} precision={0.5} readOnly />
                            <Typography>{rating.comment}</Typography>
                        </CardContent>
                        <CardActions style = {{justifyContent: 'center'}}>
                        </CardActions>
                    </Card>
                )
        
            })}
        </Stack>

   </Box>
  )
}

