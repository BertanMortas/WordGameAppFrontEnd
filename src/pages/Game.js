import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Modal,
  Box,
} from "@mui/material";
import ButtonAppBar from "../components/NavBar";

const Game = () => {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [triedWords, setTriedWords] = useState("");
  const [response, setResponse] = useState(null);
  const [failureMessage, setFailureMessage] = useState("");
  const [open, setOpen] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8070/api/v1/game/find-all")
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
        const fetchRemainingLifePromises = data.map((game) =>
          fetchRemainingLife(game.gameId, token)
        );

        Promise.all(fetchRemainingLifePromises)
          .then((remainingLifeData) => {
            const updatedGames = data.map((game, index) => ({
              ...game,
              remainingLife: remainingLifeData[index],
            }));
            setGames(updatedGames);
          })
          .catch((error) =>
            console.error("Error fetching remaining life:", error)
          );
      })
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  const fetchRemainingLife = (gameId, token) => {
    return fetch(
      `http://localhost:8070/api/v1/tries/find-life/${token}/${gameId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Remaining Life for Game", gameId, ":", data);
        return data;
      })
      .catch((error) => {
        console.error(
          "Error fetching remaining life for game",
          gameId,
          ":",
          error
        );
        return 0;
      });
  };

  const handlePlayGame = (gameId) => {
    setSelectedGameId(gameId);
    setTriedWords("");
    setResponse(null);
    setFailureMessage("");
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const requestData = {
      gameId: selectedGameId,
      triedWords: triedWords,
      token: token,
    };

    fetch("http://localhost:8070/api/v1/tries/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 4351) {
          setFailureMessage(data.message);
          setResponse(null);
        } else if (data.code === 4352) {
          setFailureMessage(data.message);
          setResponse(data);
        } else {
          console.log("Tries created successfully", data);
          setResponse(data);
          setFailureMessage("");
        }
      })
      .catch((error) => console.error("Error creating tries:", error));
  };

  console.log("Games in state:", games);
  return (
    <>
      <ButtonAppBar></ButtonAppBar>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          Game Page
        </Typography>

        <Grid container spacing={3}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.gameId}>
              <Card sx={{ backgroundColor: "#F7FFE5" }}>
                <CardContent>
                  <Typography variant="h6">{game.gameName}</Typography>
                  <Typography variant="body1">
                    Remaining Life: {game.remainingLife}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handlePlayGame(game.gameId)}
                    sx={{
                      mt: 2,
                      backgroundColor: "#A0C49D",
                      "&:hover": {
                        backgroundColor: "#A7C5EB",
                      },
                    }}
                  >
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Enter Your Tried Words
            </Typography>
            <TextField
              label="Tried Words"
              fullWidth
              value={triedWords}
              onChange={(e) => setTriedWords(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#A0C49D",
                "&:hover": {
                  backgroundColor: "#A7C5EB",
                },
              }}
            >
              Submit
            </Button>
            {failureMessage && (
              <Typography variant="body1" sx={{ mt: 2, color: "red" }}>
                {failureMessage}
              </Typography>
            )}
            {response && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Guessed Word: {response.guessedWord}
                <br />
                Letter In The Right Place: {response.letterInTheRightPlace}
                <br />
                Correctly Guessed Letters: {response.correctlyGuessedLetters}
                <br />
                Correctly Guessed Letters In The Wrong Place:{" "}
                {response.correctlyGuessedLettersInTheWrongPlace}
                <br />
                Remaining Life: {response.remainingLife}
              </Typography>
            )}
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Game;
