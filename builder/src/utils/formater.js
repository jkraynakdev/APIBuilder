// Add blocks of code to interact with status codes
function statusResponses(status, response) {
  const responseTemplate = `
  res.status(${status}).json({ message: "${response}" });`;
  return responseTemplate;
};

// Stores the boilerplate server.js data
const serverCode = `
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
});`;

// Update eventually for user file uploads
const dataPath = `
const dataPath = "./data/data.json";
`;

// Stores helper functions for writing/reading JSON files
// Update the dataPath soon!!!
const helpers = `
const dataPath = "./data/data.json";
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
`

// Getting all elements from a path
function getAllElements() {
  return `
app.get("/", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});`;
};

// Add an element to a path
function addElement() {
  return `
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
`;
};

// Delete an element
function deleteElement() {
  return `
router.delete("/:id", (req, res) => {
  readFile((data) => {
    const userId = req.params["id"];
    delete data[userId];

    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send(\`users id:\${userId} removed\`);
    });
  }, true);
});
`;
};

// Takes in a list of HTTP blocks that the user wants to use
function createIndividualRoute(request){
  switch(request){
    case 'deleteElement':
      return deleteElement();
      break;
    case 'getAllElements':
      return getAllElements();
      break;
    case 'addElement':
      return addElement();
      break;
    default:
      console.log('Something went wrong');
      return '';
    }
};


// Takes in a list of paths inputed and outputs routes
function createRoutes(paths){
  let routes = [];          // Will store strings containing necessary routes

  // Make a list of all unique first-order paths
  paths.map((path) => {
    // Only have to reduce if more than 1 occcurence of '/'
    if((path.value.match(/\//g) || []).length >= 2) {
      let index = path.value.indexOf('/', path.value.indexOf('/') + 1);
      routes = [...routes, path.value.substring(0, index)];
    } else {
      routes = [...routes, path.value];
    }
  });
  routes = [...new Set(routes)];    // Get rid of duplicates
  return routes;
};

//  routePaths list of all the paths on AP
function createAppCode(routePaths) {
  // Store entirety of the created code for the app.js file
  let finalCode = `
const express = require('express');
const app = express();
`;
  // Iterate through lists
  let index = 0;
  routePaths.map((routePath) => {
    let routeFile = './routes' + routePath +'.js';
    let template = `
const ${routePath.substr(1)} = require('${routeFile}');
app.use('${routePath}', ${routePath.substr(1)});
`;
    finalCode = finalCode + template;
    index = index + 1;
  });
  return finalCode + `

  module.exports = app;`;

};

const templates = {
  // Generate route paths for file creation
  generateRoutePaths: function(paths){
    let routeFilePaths = [];  // Stores final list of file paths
    let reducedPaths =  createRoutes(paths);

    reducedPaths.map((path) => {
      routeFilePaths = [...routeFilePaths, path];
    });

    return routeFilePaths;
  },

  // Includes REST commands such as GET,POST,DEL,PUSH, etc.
  // Returns a list including server code, app.js code, and routes code
  restTemplate: function(type, path){

    let finalProduct = [];    // Array to store strings of the code
    let index = 0;    // For iterating over inputs

    // Add in server code
    finalProduct = [...finalProduct, serverCode];

    // Add in app code
    finalProduct = [... finalProduct, createAppCode(createRoutes(path))];

    // Create object list with reduce paths as key and type as the value for
    // route creation
    let k = 0;
    let assocValues = [];
    type[1].map((instType) => {
      assocValues.push({name: path[k].value, value: instType.value});
      k = k+1;
    });
    // Reduce these paths
    let reducedPathsValues = createRoutes(path);
    let routePairs = [];   // Stores the reduced paths and the functions associated
    let i = 0;
    reducedPathsValues.map((reducedPath) => {
      assocValues.map((data) => {
        if(data.name.includes(reducedPath)){
          routePairs.push({name: reducedPath, value: data.value});
        }
      });
    });
    // Temp list to store code associated to the routes
    let routeCode = [];
    // Create placeholders where we will add code to
    reducedPathsValues.map((reducedPath) => {
      routeCode.push({name: reducedPath, value: helpers});
    });
    routeCode.map((data) => {
      routePairs.map((pair) => {
        if(pair.name == data.name) {
          data.value = data.value + createIndividualRoute(pair.value);
        }
      });
      finalProduct = [...finalProduct, data.value];   // Add to the final product
    });

    return finalProduct;
  },
}

export default templates;
