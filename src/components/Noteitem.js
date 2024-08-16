import React from "react";

const NoteItem = ({ note, updateNote, deleteNote }) => {
  return (
    <tr>
      {/* Name */}
      <td>{note.name}</td>

      {/* Role */}
      <td>{note.role}</td>

      {/* Contact */}
      <td>{note.contact}</td>

      {/* Action Icons */}
      <td className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm me-2"
          onClick={() => updateNote(note)}
          title="Edit"
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => deleteNote(note._id)}
          title="Delete"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default NoteItem;
