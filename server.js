const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Use the routes from routes.js
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
