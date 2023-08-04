import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import ButtonAppBar from "../components/NavBar";
import { blue } from "@mui/material/colors";
import { Padding } from "@mui/icons-material";

const AdminPage = () => {
  const [games, setGames] = useState([]);
  const [newGameName, setNewGameName] = useState("");
  const [newKeyWord, setNewKeyWord] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedGame, setEditedGame] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8070/api/v1/game/find-all")
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
        console.log("Fetched data:", data);
      })
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  const handleCreateGame = () => {
    const newGame = {
      token: token,
      keyWord: newKeyWord,
      gameName: newGameName,
    };

    fetch("http://localhost:8070/api/v1/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New game created:", data);
        setNewGameName("");
        setNewKeyWord("");
        fetch("http://localhost:8070/api/v1/game/find-all")
          .then((response) => response.json())
          .then((data) => {
            setGames(data);
          });
      })
      .catch((error) => console.error("Error creating game:", error));
  };

  const handleDeleteGame = (gameId) => {
    fetch(`http://localhost:8070/api/v1/game/delete-by-id/${gameId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return fetch("http://localhost:8070/api/v1/game/find-all");
        } else {
          throw new Error("Failed to delete game");
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Game deleted successfully");
        setGames(data);
      })
      .catch((error) => console.error("Error deleting game:", error));
  };

  const handleEditGame = (game) => {
    setEditedGame(game);
    setIsDialogOpen(true);
  };

  const handleUpdateGame = () => {
    if (editedGame) {
      const updatedGame = {
        gameId: editedGame.gameId,
        keyWord: newKeyWord,
        gameName: newGameName,
      };

      fetch(`http://localhost:8070/api/v1/game/change-keyword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGame),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Game updated successfully");
          // Update the game list after successful update
          fetch("http://localhost:8070/api/v1/game/find-all")
            .then((response) => response.json())
            .then((data) => {
              setGames(data);
            });
        })
        .catch((error) => console.error("Error updating game:", error));
    }
    setIsDialogOpen(false);
  };

  console.log("Games in state:", games);

  return (
    <>
      <ButtonAppBar></ButtonAppBar>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          Admin Page
        </Typography>
        <TextField
          label="Game Name"
          fullWidth
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Key Word"
          fullWidth
          value={newKeyWord}
          onChange={(e) => setNewKeyWord(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCreateGame}
          sx={{
            mb: 3,
            backgroundColor: "#FAC07D",
            "&:hover": {
              backgroundColor: "#A7C5EB",
            },
          }}
        >
          Create New Game
        </Button>
        <Grid container spacing={3}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.gameId}>
              <Card sx={{ backgroundColor: "#F7FFE5" }}>
                <CardContent>
                  <Typography variant="h6">{game.gameName}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Key Word: {game.keyWord}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 8, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleEditGame(game)}
                      sx={{
                        backgroundColor: "#A0C49D",
                        "&:hover": {
                          backgroundColor: "#A7C5EB",
                        },
                      }}
                    >
                      Edit Game
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteGame(game.gameId)}
                      sx={{
                        backgroundColor: "#F8B195",
                        "&:hover": {
                          backgroundColor: "#A7C5EB",
                        },
                      }}
                    >
                      Delete Game
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogContent>
            <TextField
              label="Game Name"
              fullWidth
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Key Word"
              fullWidth
              value={newKeyWord}
              onChange={(e) => setNewKeyWord(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleUpdateGame}
              sx={{
                mb: 3,
                backgroundColor: "#FAC07D",
                "&:hover": {
                  backgroundColor: "#A7C5EB",
                },
              }}
            >
              Update Game
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminPage;
