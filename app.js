import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 9000;

app.use(express.static(path.join(__dirname, "build")));

// app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => {
  console.log("hey");
  // res.render("index", {});
  // res.sendFile(path.join(__dirname, "dist", "index.js"));
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port);

// const express = require('express');
// const path = require('path');
//
// const app = express();
//
// app.use(express.static(path.join(__dirname, 'build')));
//
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
//
// const port = process.env.PORT || 5000;
// app.listen(port);
//
// console.log('App is listening on port ' + port);
