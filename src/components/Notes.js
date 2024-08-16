import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote, deleteNote } = context;

  const [note, setNote] = useState({
    id: "",
    name: "",
    role: "",
    contact: "",
  });

  const [deleteMessage, setDeleteMessage] = useState(""); // State for delete message
  const [noteToDelete, setNoteToDelete] = useState(null); // Note to be deleted

  const ref = useRef(null);
  const refClose = useRef(null);
  const deleteModalRef = useRef(null); // Reference to open the delete confirmation modal

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      name: currentNote.name,
      role: currentNote.role,
      contact: currentNote.contact,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validation logic
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const rolePattern = /^[A-Za-z\s]+$/;

    if (note.name.trim().length < 3) {
      alert("Name must be at least 3 characters long and cannot be empty or just spaces!");
      return;
    }

    if (!namePattern.test(note.name)) {
      alert("Name should only contain letters and spaces!");
      return;
    }

    if (note.role.trim().length < 3) {
      alert("Role must be at least 3 characters long and cannot be empty or just spaces!");
      return;
    }

    if (!rolePattern.test(note.role)) {
      alert("Role should only contain letters and spaces, and cannot include numbers!");
      return;
    }

    if (note.contact.trim().length < 3) {
      alert("Contact must be at least 3 characters long and cannot be empty or just spaces!");
      return;
    }

    if (!emailPattern.test(note.contact) && !phonePattern.test(note.contact)) {
      alert("Contact should be a valid 10-digit phone number or a valid email address!");
      return;
    }

    try {
      await editNote(note.id, note.name, note.role, note.contact);
      refClose.current.click();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    deleteModalRef.current.click(); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await deleteNote(noteToDelete._id);
      setDeleteMessage("Employee deleted successfully!");

      // Clear delete message after 3 seconds
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setDeleteMessage("Failed to delete employee.");
    } finally {
      setNoteToDelete(null); // Clear the note to delete
    }
  };

  const onChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <AddNote />

      {/* Success message for deletion */}
      {deleteMessage && (
        <div className={`alert ${deleteMessage.includes("successfully") ? "alert-success" : "alert-danger"} my-3`}>
          {deleteMessage}
        </div>
      )}

      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Employee Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={note.name}
                    aria-describedby="nameHelp"
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    name="role"
                    value={note.role}
                    aria-describedby="roleHelp"
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contact" className="form-label">
                    Contact
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contact"
                    name="contact"
                    value={note.contact}
                    onChange={onChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                Update changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <button
        ref={deleteModalRef}
        type="button"
        className="btn btn-danger d-none"
        data-bs-toggle="modal"
        data-bs-target="#deleteModal"
      >
        Delete Confirmation Modal
      </button>

      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">
                Confirm Deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to permanently delete this employee?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                data-bs-dismiss="modal"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-3">
        <h2>All Employees</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Contact</th>
             
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <Noteitem
                key={note._id}
                note={note}
                updateNote={updateNote}
                deleteNote={() => handleDeleteClick(note)} // Trigger delete confirmation modal
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Notes;
