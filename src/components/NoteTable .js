import React from "react";
import NoteItem from "./Noteitem";

const NoteTable = ({ notes = [], updateNote, deleteNote }) => {
  return (
    <div className="container mt-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No notes available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NoteTable;
