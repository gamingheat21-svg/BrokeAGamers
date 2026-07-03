const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We'll import routes here later
app.use('/api/auth', require('./routes/auth'));
app.use('/api/specs', require('./routes/specs'));


app.use('/api/deals', require('./routes/deals'));
app.use('/api/games', require('./routes/games'));
app.use('/api/compatibility', require('./routes/compatibility'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/recommendations', require('./routes/recommendations'));

app.get('/', (req, res) => {
  res.send('GameDealHunt API is running...');
});

const PORT = process.env.PORT || 5000;

// Initialize DB schema
const initDB = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf-8');
    await db.query(schema);
    console.log('Database schema initialized.');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
};

app.listen(PORT, async () => {
  await initDB();
  console.log(`Server is running on port ${PORT}`);
});
