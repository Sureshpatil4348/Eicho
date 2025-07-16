import React from 'react'
import { Box, Card, CardContent, Typography, TextField, InputAdornment, Button, Link as MUILink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';
import Logo from '@renderer/assets/images/logo.svg'

const LoginPage: React.FunctionComponent = () => {
  return (
    <Box sx={{ height: '100vh', backgroundColor: '#eaf1f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
    </Box>
  )
}

export default LoginPage
