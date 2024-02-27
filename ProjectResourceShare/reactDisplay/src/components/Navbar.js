import { AppBar, MenuItem, Toolbar, makeStyles} from "@material-ui/core";
import{ Link } from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from "./App";

const useStyles = makeStyles((theme) => ({
    toolbar: {
    display: 'flex',
    justifyContent: 'space-between', 
  },
  loginButton: {
    marginLeft: 'auto',
    backgroundColor: '#3289a8',
  },
}));

  //const [Authorized, setAuthorized] = useState(false)

  /*if (localStorage.getItem("accessToken") != null){
      console.log(localStorage.getItem("accessToken"))
      setAuthorized(true)
  }*/

  const Navbar = () => {
    const classes = useStyles();
    
    const [isAuthorized, setIsAuthorized] = useContext(Context);

    
    useEffect( () =>{
      let accessToken = localStorage.getItem("accessToken");
      setIsAuthorized(accessToken != null);
      console.log("IsAuthorized: ", isAuthorized);
    }); //empty array is a dependancy array */
    

  return(
    <AppBar>
      <Toolbar>
          <MenuItem component={Link} to = "/home">
            My Courses
          </MenuItem>
          <MenuItem component={Link} to = "/uploads">
            My Uploads
          </MenuItem>
          <MenuItem component={Link} to = "/Saved">
            Saved Resources
          </MenuItem>
          <MenuItem component={Link} to = "/TrustGraph">
            Trust Graph
          </MenuItem>
          {/*Could you use useEffect here w/ dependancy array to make it rerender when isAuthorized changes */}
        {isAuthorized ? (
        <MenuItem className = {classes.loginButton} component={Link} to = "/logout">
          Logout
        </MenuItem>
        ) : (
        <MenuItem className = {classes.loginButton} component={Link} to = "/login">
          Login
        </MenuItem>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
