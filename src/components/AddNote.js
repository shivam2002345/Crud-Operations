import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ name: "", role: "", contact: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const validateRole = (role) => {
    const roleRegex = /^[a-zA-Z\s]+$/;
    return roleRegex.test(role);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validation checks
    if (!note.name.trim()) {
      newErrors.name = "Name is required and cannot be just spaces.";
    } else if (note.name.length < 3) {
      newErrors.name = "Name must be at least 5 characters long.";
    } else if (!validateName(note.name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    if (!note.role.trim()) {
      newErrors.role = "Role is required and cannot be just spaces.";
    } else if (note.role.length < 3) {
      newErrors.role = "Role must be at least 3 characters long.";
    } else if (!validateRole(note.role)) {
      newErrors.role = "Role must contain only letters and spaces, and cannot include numbers.";
    }

    if (!note.contact) {
      newErrors.contact = "Contact is required.";
    } else if (!validateEmail(note.contact) && !validateMobileNumber(note.contact)) {
      newErrors.contact = "Contact must be a valid email or a 10-digit mobile number.";
    }

    // If there are errors, prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Add the note
      await addNote(note.name, note.role, note.contact);

      // Clear the form fields
      setNote({ name: "", role: "", contact: "" });
      setErrors({}); // Clear any previous errors
      setSuccessMessage("Employee added successfully!"); // Set success message

      // Remove success message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.error("Error adding note:", error);
      setErrors({ submit: "Failed to add employee." });
    }
  };

  const onChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear the error for the current field
  };

  return (
    <div className="container my-3">
      <h1>Add an Employee</h1>
      {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form className="my-3" onSubmit={handleClick}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="name"
            name="name"
            value={note.name}
            onChange={onChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <input
            type="text"
            className={`form-control ${errors.role ? "is-invalid" : ""}`}
            id="role"
            name="role"
            value={note.role}
            onChange={onChange}
          />
          {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact
          </label>
          <input
            type="text"
            className={`form-control ${errors.contact ? "is-invalid" : ""}`}
            id="contact"
            name="contact"
            value={note.contact}
            onChange={onChange}
          />
          {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Add ➕
        </button>
      </form>
    </div>
  );
};

export default AddNote;
