import React, { useEffect, useState, View, StyleSheet } from 'react';
import { useForm } from "react-hook-form";

const DropDownField = ({handleDropDownChange})  => (
  <form>
    <select onChange={(event) => handleDropDownChange(event)}>
      <option value="getAllElements">Get All Elements</option>
      <option value="addElement">Add Elements</option>
      <option value="deleteElement">Delete Elements</option>
    </select>
  </form>
);

export default DropDownField;
