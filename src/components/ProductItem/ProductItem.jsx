import React, {useState} from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import './ProductItem.css';

const ProductItem = ({product, className, onAdd, onRemove, addedItems}) => {
    const [itemNumber, setItemNumber] = useState(Object.values(addedItems).filter(item => item.id === product.id).length);

    const onRemoveHandler = () => {
        setItemNumber(onRemove(product));
    }

    const onAddHandler = () => {
        setItemNumber(onAdd(product));
    }

    return (
        <div className={'product ' + className}>
            <div className='header'>
                {Boolean(itemNumber) && 
                    <div className='counter'>
                        {itemNumber}
                    </div>
                }
                {product.title}
            </div>
            
            <div className={'price'}>
                <b>{product.price} ₽</b>
            </div>
            <div className='Buttons'>
                {!Boolean(itemNumber) && (
                    <Button variant="contained" className={'add-btn'} onClick={onAddHandler}>
                        ADD
                    </Button>
                )}
                {Boolean(itemNumber) && (
                    <>
                        <IconButton variant="contained" className={'remove-btn'} onClick={onRemoveHandler}>
                            <RemoveIcon />
                        </IconButton>
                        <IconButton variant="contained" className={'plus-btn'} onClick={onAddHandler}>
                            <AddIcon />
                        </IconButton>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductItem;
