const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
//const database = require('./configs/db');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get('/api/test-db', async (req, res) => {
//   try {
//     const [rows] = await database.query('SELECT 1 + 1 AS solution');
//     res.json({ 
//       database: 'Connected successfully', 
//       solution: rows[0].solution 
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Database connection failed', details: err.message });
//   }
// });

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

//listen to the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));