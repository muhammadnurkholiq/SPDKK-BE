require('dotenv').config();
const express = require('express');
const cors = require('cors');

const router = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.use('/api/v1/', router);

app.get('/', (req, res) => {
  res.send('Server Successfuly Running');
});

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
