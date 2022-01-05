const fs = require('fs');

function createMethods() {
  var methods = document.getElementById("methods").value;
  alert(methods);
  writeToFile();
}

let writeToFile = () => {
  fs.writeFile("test.js", "Hey there!", function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
};
