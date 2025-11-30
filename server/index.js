const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize local database
const localDB = require('./utils/localDB');
console.log('Local database initialized');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/connections', require('./routes/connections'));

// Basic Route
app.get('/', (req, res) => {
  res.send('CampusSphere API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
