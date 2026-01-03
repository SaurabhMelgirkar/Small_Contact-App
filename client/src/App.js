import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000/api/contacts" 
  : "https://small-contac-t-app.onrender.com/api/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    const res = await axios.get(API_URL);
    setContacts(res.data);
  };

  const validate = () => {
    return formData.name && formData.phone && /\S+@\S+\.\S+/.test(formData.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
      fetchContacts(); // Refresh list without reload
      alert("Contact Saved!");
    } catch (err) { alert("Error saving contact"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchContacts();
  };

  return (
    <div className="container">
      <h2>Contact Management</h2>
      
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <input placeholder="Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Email *" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input placeholder="Phone *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
        <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
        <button type="submit" disabled={!validate() || loading}>
          {loading ? "Submitting..." : "Add Contact"}
        </button>
      </form>

      <hr />

      {/* Contact List */}
      <h3>Saved Contacts</h3>
      <div className="contact-list">
        {contacts.map(c => (
          <div key={c._id} className="contact-card">
            <p><strong>{c.name}</strong> - {c.email}</p>
            <p>{c.phone} | <small>{c.message}</small></p>
            <button onClick={() => handleDelete(c._id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;