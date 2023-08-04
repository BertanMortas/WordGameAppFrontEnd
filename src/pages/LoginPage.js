import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
const defaultTheme = createTheme();

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let enteredEmail = data.get("email");
    let enteredPassword = data.get("password");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enteredEmail)) {
      toast.error("Please enter a valid email address.", {
        autoClose: 2000,
      });
      return;
    }

    fetch("http://localhost:8060/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        }
        throw new Error("Login failed");
      })
      .then((data) => {
        console.log(data);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("roles", data.roles);

        if (rememberMe) {
          localStorage.setItem("email", enteredEmail);
          localStorage.setItem("password", enteredPassword);
        } else {
          const existingEmail = localStorage.getItem("email");
          const existingPassword = localStorage.getItem("password");

          if (!existingEmail || !existingPassword) {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
          } else {
            enteredEmail = existingEmail;
            enteredPassword = existingPassword;
          }
        }

        if (data.roles.includes("USER")) {
          navigate("/game");
        } else if (data.roles.includes("ADMIN")) {
          navigate("/admin-page");
        } else {
          toast.error("Login failed. Incorrect email or password.");
        }
      })
      .catch((error) => {
        toast.error("Login process failed. Please try again.", {
          autoClose: 3000,
        });
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <RouterLink to="/forgot-password" variant="body2">
                  Forgot password?
                </RouterLink>
              </Grid>
              <Grid item>
                <RouterLink to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
