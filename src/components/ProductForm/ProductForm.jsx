import React, { useState, useCallback } from "react";

import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import "./ProductForm.css";

const FormBase = ({ model, setModel, item, counter }) => {
  const [show, setShow] = useState(true);

  const colors = ['Blue', 'Black'];

  const onClick = () => {
      setShow((show) => !show);
  };
  const onChange = (field) => (event) => {
      setModel(model => ({
          ...model,
          [item.shopId]: {
              ...model[item.shopId],
              [field]: event.target.value
          }
      }));
  };

  return (
    <div className="cart-form">
      <Button className="cart-header" variant="text" endIcon={show ? <VisibilityOffIcon/> : <VisibilityIcon/>} onClick={onClick}>{`${counter}. ${item.title}`}</Button>
      {show && (
        <>
          <TextField
            className="cart-input"
            required
            value={item?.link || ""}
            onChange={onChange('link')}
            size="small"
            label="Item link"
          />
          <div className="color-switcher">
            <TextField
                className="cart-input"
                required
                value={item?.size || ""}
                onChange={onChange('size')}
                size="small"
                label="Item size"
            />
            <TextField
                className="cart-input color"
                required
                value={item?.color || ""}
                onChange={onChange('color')}
                size="small"
                label="Button color"
                select
            >
                {colors.map(color => <MenuItem key={color} value={color}>
                    {color}
                </MenuItem>)}
            </TextField>
          </div>
          <TextField
            className="cart-input"
            required
            value={item?.itemPrice || ""}
            onChange={onChange('itemPrice')}
            size="small"
            label="Item price (¥)"
          />
        </>
      )}
    </div>
  );
};

const ProductForm = ({ items, onChange }) => {
    let counter = 0;
    return (
        <div className="FormBuy">
            {Object.keys(items).map((item) => (
                <FormBase model={items} setModel={onChange} item={items[item]} counter={++counter} />
            ))}
        </div>
    );
};

export default ProductForm;
