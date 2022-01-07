import React, { useEffect, useState, View, StyleSheet } from 'react';
import FieldEditor from 'components/FieldEditor'
import { useForm } from "react-hook-form";

function FieldForm({ fields, parentCallback, indexCallback, index }) {

  // Stores Field inputs
  const [fieldsValues, setFieldsValues] = React.useState({});
  const [dropDownSelectValue, setDropDownSelectValue] = React.useState({});

  // Handles adding a form
  const [addedFields, setAddedFields] = React.useState([fields]);

  // Maintains an equal number of fields
  if(addedFields.length != index){
    setAddedFields([...addedFields, 'field' + index]);
  }

  const handleChange = (event, fieldId) => {
    let newFields = { ...fieldsValues };
    newFields[fieldId] = event.target.value;
    console.log('Looking for this: '  + fieldId + ' and ' + event.target.value);


    setFieldsValues(newFields);

  };

  // Handle the callback values
  useEffect(() => {
      let arr=[];
      let dropDowns = []
      Object.keys(fieldsValues).forEach(key => {
          if(key.includes('dropDown')){     // Handles the dropdowns
            dropDowns.push({name: key, value: fieldsValues[key]})
          } else {  // Don't add dropdown values to arr
            arr.push({name: key, value: fieldsValues[key]})
          }
          });
      parentCallback([arr, dropDowns]);

    }, [fieldsValues, dropDownSelectValue]);

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
          dropDownId={'dropDown' + field.slice(-1)} //Index of element matches the text field
          handleChange={handleChange}
          value={fieldsValues[field]}
          dropDownCallback={(value, id) => {setDropDownSelectValue(value, id)}}
        />
      ))}

      <div>
        <button onClick={onClick}>Add one</button>
      </div>
    </div>
  );
}

export default FieldForm;
