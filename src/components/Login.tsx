import { Authenticator, View, Image } from "@aws-amplify/ui-react";
import { ThemeProvider } from "@emotion/react";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import theme from '.././styles/theme';
import useAuth from "../contexts/AuthContextProvider";

function Login() {
    const navigate = useNavigate();
  
    const { user, accessToken, signOut, userName } = useAuth()
  
    function navigateToMain() {
      navigate('/', { replace: true });
    }
  
    useEffect(() => {
      if (user) {
        navigateToMain();
      }
    });
  
    return (
      <ThemeProvider theme={theme}>
        <div style={{ margin: 20 }} className="AuthContainer">
          <Authenticator signUpAttributes={['email']} components={authComponents} >
            {({ user, signOut }) => (<></>)}
          </Authenticator>
        </div>
      </ThemeProvider>);
  }

  const authComponents = {
    Header() {
      return (
        <View textAlign="center" padding="20">
          <Image
            alt="Amplify logo"
            src="/assets/klepp_logo_boge_small.png"
            width={200}
            height={200}
            margin={20}
          />
        </View>
      );
    },
  
    Footer() {
      return (
        <View textAlign="center">
          <Typography variant='subtitle1' color='white' sx={{ mt: 2 }}>© Laget med kjærlighet av de tre vise menn</Typography>
        </View>
      )
    }
  }
  
  export default Login;
