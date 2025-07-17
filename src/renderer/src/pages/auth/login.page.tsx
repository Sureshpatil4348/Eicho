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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                    >
                      <path
                        d="M18.2422 3.46875H1.75781C0.786602 3.46875 0 4.26023 0 5.22656V15.7734C0 16.7455 0.792383 17.5312 1.75781 17.5312H18.2422C19.2053 17.5312 20 16.7488 20 15.7734V5.22656C20 4.26195 19.2165 3.46875 18.2422 3.46875ZM17.996 4.64062C17.6369 4.99785 11.4564 11.1458 11.243 11.3581C10.9109 11.6901 10.4695 11.8729 10 11.8729C9.53047 11.8729 9.08906 11.6901 8.75594 11.357C8.61242 11.2142 2.50012 5.13414 2.00398 4.64062H17.996ZM1.17188 15.5349V5.46582L6.23586 10.5031L1.17188 15.5349ZM2.00473 16.3594L7.06672 11.3296L7.9284 12.1867C8.48176 12.7401 9.21746 13.0448 10 13.0448C10.7825 13.0448 11.5182 12.7401 12.0705 12.1878L12.9333 11.3296L17.9953 16.3594H2.00473ZM18.8281 15.5349L13.7641 10.5031L18.8281 5.46582V15.5349Z"
                        fill="#298FD5"
                      />
                    </svg>
                  </div>
                  <input className="form-control" type="email" />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="field">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_68_34)">
                        <path
                          d="M10.0002 0.821777C7.05905 0.821777 4.70611 3.17472 4.70611 6.11589V8.46884C3.70611 8.46884 2.94141 9.23354 2.94141 10.2335V17.8806C2.94141 18.8806 3.70611 19.6453 4.70611 19.6453H15.2943C16.2943 19.6453 17.0591 18.8806 17.0591 17.8806V10.2335C17.0591 9.23354 16.2943 8.46884 15.2943 8.46884V6.11589C15.2943 3.17472 12.9414 0.821777 10.0002 0.821777ZM15.8826 10.2335V17.8806C15.8826 18.2335 15.6473 18.4688 15.2943 18.4688H4.70611C4.35317 18.4688 4.11788 18.2335 4.11788 17.8806V10.2335C4.11788 9.8806 4.35317 9.64531 4.70611 9.64531H5.29435H14.7061H15.2943C15.6473 9.64531 15.8826 9.8806 15.8826 10.2335ZM5.88258 8.46884V6.11589C5.88258 3.82178 7.70611 1.99825 10.0002 1.99825C12.2943 1.99825 14.1179 3.82178 14.1179 6.11589V8.46884H5.88258Z"
                          fill="#298FD5"
                        />
                        <path
                          d="M10.0001 11.4099C9.00006 11.4099 8.23535 12.1746 8.23535 13.1746C8.23535 13.9393 8.70594 14.5864 9.41182 14.8217V16.1158C9.41182 16.4687 9.64712 16.704 10.0001 16.704C10.353 16.704 10.5883 16.4687 10.5883 16.1158V14.8217C11.2942 14.5864 11.7648 13.9393 11.7648 13.1746C11.7648 12.1746 11.0001 11.4099 10.0001 11.4099ZM10.0001 13.7629C9.64712 13.7629 9.41182 13.5276 9.41182 13.1746C9.41182 12.8217 9.64712 12.5864 10.0001 12.5864C10.353 12.5864 10.5883 12.8217 10.5883 13.1746C10.5883 13.5276 10.353 13.7629 10.0001 13.7629Z"
                          fill="#298FD5"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_68_34">
                          <rect
                            width="20"
                            height="20"
                            fill="white"
                            transform="translate(0 0.233643)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
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
