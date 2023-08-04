import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    fetch(
      `http://localhost:8060/api/v1/auth/forgot-password/${email}/${name}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Forgot password failed");
      })
      .then((data) => {
        console.log(data);
        if (data) {
          console.log("Forgot password successful!");
          navigate("/");
        } else {
          console.log("Forgot password failed.");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Forgot password failed.", error);
      });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <Typography variant="h4">Forgot Password</Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ my: 1, width: "100%" }}
      />
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ my: 1, width: "100%" }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};

export default ForgotPasswordPage;
