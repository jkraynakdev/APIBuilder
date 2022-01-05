const express = require('express');
const router = express.Router();
const fs = require('fs');
const dataPath = "./data/userData.json";

// Helper readFile command
const readFile = (callback, returnJson = false, filePath = dataPath,
                  encoding = "utf8") => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err;
    }

    callback(returnJson ? JSON.parse(data) : data);
  });
};

// Helper writeFile command
const writeFile = (fileData, callback, filePath = dataPath,
                   encoding = "utf8") => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err;
    }

    callback();
  });
};


// Display all resources in a path
router.get('/', (req, res, next) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

// Delete users
router.delete("/:id", (req, res) => {
  readFile((data) => {
    const userId = req.params["id"];
    delete data[userId];

    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send(`users id:${userId} removed`);
    });
  }, true);
});

// Add user
router.post("/", (req, res) => {
  readFile((data) => {
    const newUserId = Object.keys(data).length + 1;

    // add the new user
    data[newUserId] = JSON.parse(req.body.data);

    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send("new user added");
    });
  }, true);
});


// Generic error handling
router.all('*',(req,res) => {
  res.status(404).send('404 Invalid Request');
});

module.exports = userRoutes;
