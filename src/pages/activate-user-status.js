import { Link } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Box, Button, Container, SvgIcon, Typography } from "@mui/material";

const Page = () => (
  <Box
    component="main"
    sx={{
      alignItems: "center",
      display: "flex",
      flexGrow: 1,
      minHeight: "100%",
    }}
  >
    <Container maxWidth="md">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            mb: 3,
            textAlign: "center",
          }}
        >
          <img
            alt="Under development"
            src="https://static.vecteezy.com/system/resources/previews/016/186/785/original/activation-account-with-fingerprint-recognition-technology-touch-id-security-system-free-vector.jpg"
            style={{
              display: "inline-block",
              maxWidth: "100%",
              width: 500,
            }}
          />
        </Box>
        <Typography align="center" sx={{ mb: 3 }} variant="h5">
          The first step of your account activation process is complete.
        </Typography>
        <Button
          component={Link}
          to="/"
          startIcon={
            <SvgIcon fontSize="small">
              <ArrowLeftIcon />
            </SvgIcon>
          }
          sx={{ mt: 3 }}
          variant="contained"
        >
          Go back to Login
        </Button>
      </Box>
    </Container>
  </Box>
);

export default Page;
