import React, { useState, useCallback, useEffect } from "react";
import "./ProductList.css";
import ProductForm from "../ProductForm/ProductForm";
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";

import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";

const products = [
  { id: "1", title: "👟 Кроссовки", price: 2000, priceFast: 6500 },
  { id: "2", title: "🥾 Ботинки", price: 2100, priceFast: 7000 },
  { id: "10", title: "🥋 Толстовки, кофты, легкие куртки", price: 1500, priceFast: 5000 },
  { id: "3", title: "👕 Футболки , шорты", price: 1300, priceFast: 4500 },
  { id: "4", title: "👖 Штаны, джинсы", price: 1500, priceFast: 5000 },
  { id: "5", title: "🧥 Зимние куртки, пальто", price: 1700, priceFast: 5500 },
  { id: "6", title: "🧦 Носки, майки, нижнее белье", price: 700, priceFast: 4000 },
  { id: "7", title: "🕶️ Очки, парфюм, украшения, часы", price: 700, priceFast: 4000 },
  { id: "11", title: "🧢 Головные уборы", price: 700, priceFast: 4000 },
  { id: "8", title: "👜 Сумки (маленькие)", price: 1400, priceFast: 5000 },
  { id: "9", title: "🎒 Сумки (большие)", price: 1700, priceFast: 6500 },
];

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc +=
      (item.delivery_type === '🚛 Default (15-20 days)' ? item.price : item.priceFast) +
      parseInt(item.itemPrice * 14.0) +
      (items.length >= 3 ? 750 : 1000));
  }, 0);
}

const ProductList = () => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [addedItems, setAddedItems] = useState({});

  const delivery = ['Самовывоз', 'Доставка (СДЭК)'];

  const [otherStuff, setOtherStuff] = useState({});
  const [deliveryType, setDeliveryType] = useState(false);

  const { tg } = useTelegram();

  const onAdd = useCallback(
    (product) => {
      const item = {
        ...product,
        shopId: randomIntFromInterval(1, 1000000),
      };
      setAddedItems((items) => ({
        ...items,
        [item.shopId]: { ...item },
      }));
      return (
        Object.values(addedItems).filter((item) => item.id === product.id)
          .length + 1
      );
    },
    [setAddedItems, addedItems]
  );

  const onRemove = useCallback(
    (product) => {
      setAddedItems((newItems) => {
        const items = Object.values(newItems).filter(
          (item) => item.id === product.id
        );
        const lastItem = items[items.length - 1];
        const { [lastItem.shopId]: _, ...other } = newItems;
        return other;
      });
      const items = Object.values(addedItems).filter(
        (item) => item.id === product.id
      );
      return items.length - 1;
    },
    [setAddedItems, addedItems]
  );

  const onCart = () => {
    setIsCart((cart) => !cart);
  };

  const onCheckout = () => {
    setIsCheckout((checkout) => !checkout);
  };

  const onSendData = useCallback(() => {
    const data_tg = tg.initData;
    tg.sendData(
      JSON.stringify(
        {
          data: {...addedItems}, 
          other: {
            type: deliveryType, fio: otherStuff?.fio || '', phone: otherStuff?.phone || '', point: otherStuff?.point || '',
            tgInit: data_tg
          }
        }
      )
    );
  }, [addedItems, deliveryType, otherStuff, tg.initData]);


  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: "BUY",
    });
  }, []);

  useEffect(() => {
    if (
      isCheckout && (
        (
          deliveryType === 'Доставка (СДЭК)' &&
          (otherStuff?.fio || '').length && 
          (otherStuff?.point || '').length && 
          (otherStuff?.phone || '').length
        ) || 
        deliveryType === 'Самовывоз'
      )
    ) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [isCheckout, deliveryType, otherStuff]);

  const completedFields = () => {
    return Boolean(
      Object.values(addedItems).filter(
        (item) =>
          !item?.link ||
          !item?.link.length ||
          !item?.size ||
          !item?.size.length ||
          !item?.color ||
          !item?.color.length ||
          !item?.itemPrice ||
          !item?.itemPrice.length ||
          !item?.delivery_type ||
          !item?.delivery_type.length
      ).length
    );
  };
  let counter = 0;
  return (
    <>
      {isCheckout && (
        <div className="OrderContainer">
          <div className="order-header-base">
            <div className="order-header">
              TOTAL: {getTotalPrice(Object.values(addedItems))} ₽
            </div>
            <Button
              variant="outlined"
              color="success"
              className={"edit-btn"}
              onClick={onCheckout}
            >
              Edit
            </Button>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TextField
                className="testItem"
                required
                value={deliveryType || ""}
                onChange={event => {setDeliveryType(event.target.value), setOtherStuff({})}}
                size="small"
                label="Способ получения посылки"
                select
            >
                {delivery.map(del => 
                  <MenuItem key={del} value={del}>
                    {del}
                  </MenuItem>
                )}
            </TextField>
            {deliveryType === 'Самовывоз' && (
              <div style={{ margin: '10px 20px' }}>
                <p>
                  • г. Москва, Мичуринский пр-т. д. 51
                <br /><br />
                  Время работы: 19:00 – 21:00 (Ежедневно)
                </p>
              </div>
            )}
            {deliveryType === 'Доставка (СДЭК)' && (
              <>
                <TextField
                  className="testItem"
                  required
                  value={otherStuff.point || ""}
                  onChange={event => setOtherStuff(old => ({...old, point: event.target.value}))}
                  size="small"
                  label="Город, адрес пункта СДЭК"
                />
                <TextField
                    className="testItem"
                    required
                    value={otherStuff?.fio || ""}
                    onChange={event => setOtherStuff(old => ({...old, fio: event.target.value}))}
                    size="small"
                    label="ФИО"
                />
                <TextField
                    className="testItem"
                    required
                    value={otherStuff?.phone || ""}
                    onChange={event => setOtherStuff(old => ({...old, phone: event.target.value}))}
                    size="small"
                    label="Номер телефона"
                />
              </>
            )}
          </div>
          {Object.values(addedItems).map((item) => {
            return (
              <div className="product finish-data">
                <div className="header">{`${++counter}. ${item.title}`}</div>
                <div className="item-price">
                  <div>Товар: {parseInt(item.itemPrice * 14.0)} ₽</div>
                  <div>Доставка: {item.delivery_type === '🚛 Default (15-20 days)' ? item.price : item.priceFast} ₽</div>
                  <div>
                    Комиссия:{" "}
                    {Object.values(addedItems).length >= 3 ? 750 : 1000} ₽
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!isCheckout && isCart && (
        <div className="OrderContainer">
          <div className="order-header-base">
            <div className="order-header">YOUR ORDER:</div>
            <Button
              variant="outlined"
              color="success"
              className={"edit-btn"}
              onClick={onCart}
            >
              Edit
            </Button>
          </div>
          <ProductForm items={addedItems} onChange={setAddedItems} />
          {!completedFields() && (
            <Button
              variant="contained"
              className={"order-btn"}
              onClick={onCheckout}
            >
              CHECKOUT
            </Button>
          )}
        </div>
      )}

      {!isCart && (
        <div className={"list"}>
          <div className="base-header">Choose options:</div>
          {products.map((item) => (
            <ProductItem
              product={item}
              addedItems={addedItems}
              onAdd={onAdd}
              onRemove={onRemove}
              className={"item"}
            />
          ))}
          {Boolean(Object.keys(addedItems).length) && (
            <Button
              variant="contained"
              className={"order-btn"}
              onClick={onCart}
            >
              VIEW ORDER ({Object.keys(addedItems).length} items)
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default ProductList;
