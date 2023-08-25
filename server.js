const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { initializeApp, applicationDefault } = require("firebase-admin/app");

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Use the routes from routes.js
app.use('/', routes);

process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: applicationDefault(),
  projectId: "food-app-2c451",
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

