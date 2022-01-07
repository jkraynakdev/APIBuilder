var fs = require('fs');

const createDir = (dirPath) => {
  fs.mkdirSync(process.cwd() + dirPath, {recursive: true}, (error) => {
    if (error) {
      console.log('An error has occured: ' + error);
    } else {
      console.log('' + dirPath + ' has been made!');
    }
  });
}


const createFile = (filePath, data) => {
  fs.writeFile(process.cwd() + path + "/test.txt", data,
                              { flag: 'wx' }, function (err) {
      if (err) throw err;
      console.log("It's saved!");
  });
}

const path = '/public/tmp/APISource';
const content = 'hello world';

exports.createDir = createDir;
exports.createFile = createFile;


/*
<div className="inputFields">
  <FieldForm fields={fields} />
</div>
*/
