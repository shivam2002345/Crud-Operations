import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:8080"; 
  const [notes, setNotes] = useState([]); 

  // Fetch all Notes
  const getNotes = async () => {
    try {
     
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZiYzI5NDFmMTZiNTM1MWQ1YmIxNzBjIn0sImlhdCI6MTcyMzYwODMxNH0.77Wf9v_CbU6twWYnFJnFpodSlPTHZt_EN-x_jHzCRBk",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");

      const json = await response.json();
      setNotes(json); 
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a Note
  const addNote = async (name, role, contact) => {
    try {
    
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZiYzI5NDFmMTZiNTM1MWQ1YmIxNzBjIn0sImlhdCI6MTcyMzYwODMxNH0.77Wf9v_CbU6twWYnFJnFpodSlPTHZt_EN-x_jHzCRBk",
        },
        body: JSON.stringify({ name, role, contact }),
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to add note: ${errorText}`);
      }

      const note = await response.json();
      setNotes(notes.concat(note));
    } catch (error) {
      console.error("Error adding note:", error);
     
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZiYzI5NDFmMTZiNTM1MWQ1YmIxNzBjIn0sImlhdCI6MTcyMzYwODMxNH0.77Wf9v_CbU6twWYnFJnFpodSlPTHZt_EN-x_jHzCRBk",
        },
      });

      if (!response.ok) throw new Error("Failed to delete note");

      const json = await response.json();
      console.log(json);

      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes); 
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, name, role, contact) => {
    try {
      
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZiYzI5NDFmMTZiNTM1MWQ1YmIxNzBjIn0sImlhdCI6MTcyMzYwODMxNH0.77Wf9v_CbU6twWYnFJnFpodSlPTHZt_EN-x_jHzCRBk",
        },
        body: JSON.stringify({ name, role, contact }),
      });

      if (!response.ok) throw new Error("Failed to update note");

      const updatedNote = await response.json();

      const newNotes = notes.map((note) =>
        note._id === id ? updatedNote : note
      );

      setNotes(newNotes); 
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
