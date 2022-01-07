import React, { useEffect, useState, View, StyleSheet } from 'react';
import { useForm } from "react-hook-form";

import DropDownField from 'components/DropDownField.js';

const FieldEditor = ({ id, dropDownId, value,
                       handleChange, dropDownCallback}) => (
  <div className="field-editor">
    <input onChange={(event) => handleChange(event, id)} value={value} />
    <DropDownField handleDropDownChange={(event) => {
                                        dropDownCallback(event.target.value);
                                        handleChange(event, dropDownId)}}
                                      id={dropDownId}/>
  </div>
);

export default FieldEditor;
