const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection (Replace with your Atlas URI or local DB)
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contactDB';
// Replace <db_password> with your actual password (e.g., saurabh123)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://saurabhmelgirkar636_db_user:<db_password>@cluster0.brfmncr.mongodb.net/contactManager?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: String
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// API Routes
app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) { res.status(400).json(err); }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));