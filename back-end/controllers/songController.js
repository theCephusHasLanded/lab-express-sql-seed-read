const express = require("express");
const songs = express.Router();
const { getAllSongs, getASong, createSong, deleteSong, updateSong } = require("../queries/songs");
const { checkRequest } = require("../validations/checkSongs");
// const { checkRequest, checkId } = require('../validations/checkSongs')

//GET ROUTE
songs.get("/", async (req, res) => {
  const allSongs = await getAllSongs();

  if (allSongs) {
    res.status(200).json(allSongs);
  } else {
    res.status(500).json({ error: "Server Error" });
  }
});

//GET ONE ROUTE
songs.get("/:id", async (req, res) => {
  const { id } = req.params;
  const song = await getASong(id);


  if (song) {
    res.status(200).json(song);
  } else {
    res.status(404).json({ error: "Song not found" });
  }
});



//CREATE ROUTE
songs.post("/", async (req, res) => {
  const newSong = req.body;

  if (!newSong.title) {
    res.status(400).json({ error: "Name is missing" });
  } else if (!newSong.artist) {
    res.status(400).json({ error: "Artist is missing" });
  } else if (newSong.is_favorite !== undefined && typeof newSong.is_favorite !== "boolean") {
    res.status(400).json({ error: "is_favorite must be a boolean" });
  } else {
    try {
      const addedSong = await createSong(newSong);
      res.status(200).json(addedSong);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
});

//DELETE ROUTE
songs.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSong = await deleteSong(id);
    if(deletedSong.id){
       res.status(200).json(deletedSong);
    } else {
      throw new Error("A song with that Id does not exist")
    }
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

//UPDATE ROUTE
songs.put("/:id", async (req, res) => {
  const { id } = req.params;
  const songToUpdate = req.body;

  if (!songToUpdate.name && !songToUpdate.artist && songToUpdate.is_favorite === undefined) {
    res.status(400).json({ error: "At least one field is required to update a song" });
    return;
  }

  try {
    const updatedSong = await updateSong(id, songToUpdate);
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = songs;
