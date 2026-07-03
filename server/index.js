const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();

const clientOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim())
  : true;

// Middleware
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/specs', require('./routes/specs'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/games', require('./routes/games'));
app.use('/api/compatibility', require('./routes/compatibility'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/recommendations', require('./routes/recommendations'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'GameDealHunt API' });
});

const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('GameDealHunt API is running. Build the client to serve the full app.');
  });
}

const PORT = process.env.PORT || 5000;

// Initialize DB schema
const initDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL is not set. Auth, specs, and wishlist features will not work until a database is configured.');
      return;
    }

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
