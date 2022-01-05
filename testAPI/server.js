const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const fs = require("fs");

const app = require('./app');
const server = http.createServer(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


server.listen((process.env.PORT || 4000), () => {
  console.log("listening on port %s...", server.address().port);
});
