import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../utils/number";

const ProductCard = ({ id, productName, imgSrc, price }) => {
    const navigate = useNavigate();
    const showProduct = (id) => {
        navigate(`/product/${id}`);
    };
    return (
        <div className="card" onClick={() => showProduct(id)}>
            <img src={imgSrc} alt="" />
            <div>{productName}</div>
            <div>₩ {price}</div>
        </div>
    );
};

export default ProductCard;
