const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 2: Add a new note
router.post(
  "/addnote",
  fetchuser,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("role", "Role must be at least 3 characters").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const { name, role, contact } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        name,
        role,
        contact,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ROUTE 3: Update an existing note
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { name, role, contact } = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid Note ID" });
  }

  try {
    const newNote = {};
    if (name) newNote.name = name;
    if (role) newNote.role = role;
    if (contact) newNote.contact = contact;

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note Not Found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 4: Delete an existing note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid Note ID" });
  }

  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note Not Found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
