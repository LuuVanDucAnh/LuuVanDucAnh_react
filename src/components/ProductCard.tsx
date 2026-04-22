import React from 'react';
import "../assets/css/ProductCard.css";

type Product = {
  id?: number;
  name: string;
  description?: string;
  price: string;
  image: string;
  rating: number;
  time?: string;
  dishes?: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="product_card">
      <div className="product_image_container">
        <img src={product.image} alt={product.name} className="product_image" />
        <div className="rating_badge">
          <i className="fa-solid fa-star"></i> {product.rating}
        </div>
      </div>

      <div className="product_info">
        <h3 className="product_name">{product.name}</h3>
        <p className="product_description">{product.description || "Chuyên các món ăn thơm ngon, hấp dẫn đạt tiêu chuẩn"}</p>

        <div className="product_meta">
          <div className="meta_item">
            <i className="fa-solid fa-utensils"></i>
            <span>{product.dishes || "8 món"}</span>
          </div>
          <div className="meta_item">
            <i className="fa-regular fa-clock"></i>
            <span>{product.time || "30-45 phút"}</span>
          </div>
          <div className="meta_item">
            <i className="fa-solid fa-wallet"></i>
            <span>Tối thiểu: {product.price}</span>
          </div>
        </div>

        <button className="view_menu_btn">
          <i className="fa-solid fa-utensils"></i> Xem thực đơn
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
