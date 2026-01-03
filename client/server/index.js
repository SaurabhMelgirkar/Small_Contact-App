const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. UPDATE CORS: Allow your specific Vercel URL or leave empty to allow all (common for interviews)
app.use(cors()); 
app.use(express.json());

// 2. FIX MONGO_URI: Fixed the typo 'ongodb' to 'mongodb' and ensured environment variables take priority
// const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://saurabhmelgirkar636_db_user:<db_password>@cluster0.brfmncr.mongodb.net/contactManager?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URI = "mongodb+srv://saurabhmelgirkar636_db_user:KrxB8sm3DbJLulcn@cluster0.brfmncr.mongodb.net/contactManager?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

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
  } catch (err) { 
    console.error("Post Error:", err);
    res.status(400).json({ message: "Error saving contact", error: err }); 
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json(err); }
});

// 3. FIX PORT: Render uses process.env.PORT. Using 5000 fixed will cause a crash on deploy.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));