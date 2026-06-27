// create a server using express
const express = require('express');
const app = express();
const port = 3000;

// middleware to parse JSON requests
app.use(express.json());

// add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});