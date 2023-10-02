const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://bjmls-console.web.app', // Replace with your allowed origin(s)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable cookies and credentials
};

app.use(cors(corsOptions));

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

