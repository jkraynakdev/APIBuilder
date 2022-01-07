/*
  Time line:
    Create bash script to setup and run the API
    Error handling
    https://daveceddia.com/react-project-structure/
*/

import React, { useCallback, useEffect, useState, View, StyleSheet } from 'react';
import FieldForm from './FieldForm.js';
import FieldFormPlain from './FieldFormPlain.js'
import templates from 'utils/formater.js';
import { useForm } from "react-hook-form";
import { saveAs } from "file-saver";                // For jsZIP
import {useDropzone} from 'react-dropzone'          // For file uploads
import logo from 'images/logo.svg';
import './App.css';

function MyDropzone() {
  const onDrop = useCallback(acceptedFile => {

    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      let read = JSON.parse(acceptedFile.result);
      console.log(JSON.stringify(read));
    }
    reader.readAsText(acceptedFile);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        <p>Upload Files</p>
      }
    </div>
  )
}


function App() {
  // Store in state the list from the inputFields
  const[types, setTypes] = useState({});
  const[path, setPath] = useState({});

  // Ensures that the two sibling FieldForms maintain the same number of fields
  const[index, setIndex] = useState(1);

  // String to contain API info
  const[apiSource, setApiSource] = useState('');

  // Callback functions to get input from the FieldEditor child componentss
  const typeCallback = (value) => {
    console.log(JSON.stringify(value));
    setTypes(value);
  };

  const pathCallback = (value) => {
    setPath(value);
  };

  const indexCallback = (index) => {
    setIndex(index);
  };

  // Updates the state string apiSource
  const createAPI = () =>  {
    setApiSource(templates.restTemplate(types, path));
    console.log(apiSource);
  };

  // Creates zip file takes in list of strings containing API file info
  const createFolder = () => {
    var JSZip = require("jszip");
    var zip = new JSZip();

    let data = templates.restTemplate(types, path);

    // Create files
    zip.file("server.js", data[0]); // Server file
    zip.file('app.js', data[1]);    // App file

    // Create the data folder to store JSON data files
    var dataFolder = zip.folder('data');

    // Create Route js files
    var routeFiles = zip.folder("routes");
    let index = 0;
    data.slice(2).map((route) => {
      console.log(route);
      routeFiles.file(templates.generateRoutePaths(path)[index] + '.js',
                                                   route);
      index = index + 1;
    });

    // Download zip file
    zip.generateAsync({type:"blob"})
    .then(function (blob) {
        saveAs(blob, "API.zip");
    });
  };

  return (
    <div className="App">
      <p> Create API without code </p>

      <div className='inputFields'>
        <FieldForm fields={'field0'} parentCallback={typeCallback}
                   indexCallback={indexCallback} index={index}/>
        {JSON.stringify(types)}
      </div>
      <div className='inputFields '>
        <FieldFormPlain fields={'field0'} parentCallback={pathCallback}
                   indexCallback={indexCallback} index={index}/>
        {JSON.stringify(path)}
      </div>

      <div className='createButtons'>
        <MyDropzone />
        <br></br>
        <button onClick={createAPI}>
          Create API
        </button>
        <button onClick={createFolder}>
          Download Zip
        </button>
      </div>
    </div>
  );
}

export default App;
