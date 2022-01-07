import React, { useEffect, useState, View, StyleSheet } from 'react';
import { useForm } from "react-hook-form";

const FieldEditor = ({ id, value, handleChange, dropDownCallback}) => (
  <div className="field-editor">
    <input onChange={(event) => handleChange(event, id)} value={value} />
    <br></br>
    <br></br>
  </div>
);

function FieldFormPlain({ fields, parentCallback, indexCallback, index }) {

  // Stores Field inputs
  const [fieldsValues, setFieldsValues] = React.useState({});

  // Handles adding a form
  const [addedFields, setAddedFields] = React.useState([fields]);

  // Maintains an equal number of fields
  if(addedFields.length != index){
    setAddedFields([...addedFields, 'field' + index]);
  }

  const handleChange = (event, fieldId) => {
    let newFields = { ...fieldsValues };
    newFields[fieldId] = event.target.value;

    setFieldsValues(newFields);
  };

  // Handle the callback values
  useEffect(() => {
      let arr=[];
      Object.keys(fieldsValues).forEach(key => {arr.push({name: key,
                                                value: fieldsValues[key]})});

      parentCallback(arr);

    }, [fieldsValues]);

  // Adds a field
  const onClick = () => {
    indexCallback(index+1);
    setAddedFields([...addedFields, "field" + index]);
  };

  return (
    <div>
      {addedFields.map((field) => (
        <FieldEditor
          key={field}
          id={field}
          handleChange={handleChange}
          value={fieldsValues[field]}/>))}
      <div>
        <button onClick={onClick}>Add one</button>
      </div>
    </div>
  );
}

export default FieldFormPlain;
