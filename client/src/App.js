import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Updated to your Render URL
const API_URL = "https://small-contac-t-app.onrender.com/api/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response || err.message);
    }
  };

  const validate = () => {
    return (
      formData.name && formData.phone && /\S+@\S+\.\S+/.test(formData.email)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sending data to Render
      await axios.post(API_URL, formData);
      setFormData({ name: "", email: "", phone: "", message: "" });
      fetchContacts(); 
      alert("Contact Saved Successfully!");
    } catch (err) {
      // Detailed error logging to browser console
      console.error("Submit Error:", err.response || err.message);
      alert(`Error saving contact: ${err.response?.data?.message || "Check server logs"}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchContacts();
    } catch (err) {
      console.error("Delete Error:", err.response || err.message);
    }
  };

  return (
    <div className="container">
      <h2>Contact Management</h2>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          placeholder="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          placeholder="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          placeholder="Phone *"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <button type="submit" disabled={!validate() || loading}>
          {loading ? "Submitting..." : "Add Contact"}
        </button>
      </form>

      <hr />

      <h3>Saved Contacts</h3>
      <div className="contact-list">
        {contacts.length === 0 && !loading && <p>No contacts found.</p>}
        {contacts.map((c) => (
          <div key={c._id} className="contact-card">
            <p><strong>{c.name}</strong> - {c.email}</p>
            <p>{c.phone} | <small>{c.message}</small></p>
            <button onClick={() => handleDelete(c._id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;