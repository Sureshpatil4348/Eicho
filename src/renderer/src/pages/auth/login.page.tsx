import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Link as MUILink,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Link } from "react-router-dom";
import Logo from "@renderer/assets/images/logo.svg";
import Email from "@renderer/assets/images/email-icon.svg";
import Password from "@renderer/assets/images/password-icon.svg";

const LoginPage: React.FunctionComponent = () => {
  return (
    <>
      {/* <Box sx={{ height: '100vh', backgroundColor: '#eaf1f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <img src={Logo} alt="Forex Logo" style={{ height: 50 }} />
        </Box>

        <Card sx={{ width: 400, borderRadius: 3, boxShadow: 3, height: 500 }}>
          <CardContent sx={{ px: 4, py: 5 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Login
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
              Login With Your Personal Details
            </Typography>

            <TextField fullWidth variant="outlined" label="Email" type="email" sx={{ mb: 2, backgroundColor: '#f1f7fc' }} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              )
            }} />

            <TextField fullWidth variant="outlined" label="Password" type="password" sx={{ mb: 1.5, backgroundColor: '#f1f7fc' }} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }} />

            <Box display="flex" justifyContent="flex-end" mb={2}>
              <MUILink component={Link} to="#" underline="hover" variant="body2" color="primary">
                Forgot Password
              </MUILink>
            </Box>

            <Button fullWidth variant="contained" color="primary" size="large">
              Login
            </Button>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t Have an account?{' '}
          <MUILink component={Link} to="#" underline="hover" color="primary">
            Signup
          </MUILink>
        </Typography>
      </Box> */}
      <div className="auth_page">
        <div className="before_login_sec">
          <div className="logo">
            <a href="/">
              <img src={Logo} alt="Forex Logo" style={{ height: 50 }} />
            </a>
          </div>
          <div className="wrap_box">
            <div className="head">
              <h2>Login</h2>
              <p>Login With Your Personal Details</p>
            </div>
            <form>
              <div className="form-group">
                <label>Email</label>
                <div className="field">
                  <div className="icon">
                    <img src={Email} alt="" />
                  </div>
                  <input className="form-control" type="email" />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="field">
                  <div className="icon">
                    <img src={Password} alt="" />
                  </div>
                  <input className="form-control" type="password" />
                </div>
              </div>
              <div className="form-group forgot_password">
                <a href="#">Forgot Password</a>
              </div>
              <div className="form-group text-center">
                <button type="button" className="login">
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="allready_account">
            <span>
              Don't Have an account? <a href="#">Signup</a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
