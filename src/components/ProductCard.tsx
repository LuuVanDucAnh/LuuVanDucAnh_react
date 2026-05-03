import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleViewRestaurant = () => {
    navigate("/restaurant", { state: { restaurant: product } });
  };

  return (
    <div className="restaurant-card" onClick={handleViewRestaurant}>
      <div className="restaurant-image">
        <img src={product.image} alt={product.name} />
        <div className="restaurant-rating">
          <i className="fa-solid fa-star"></i> {product.rating}
        </div>
      </div>

      <div className="restaurant-info">
        <h3 className="restaurant-name">{product.name}</h3>
        <p className="restaurant-description">{product.description || "Chuyên các món ăn thơm ngon, hấp dẫn đạt tiêu chuẩn"}</p>

        <div className="restaurant-details">
          <div className="restaurant-detail-item">
            <i className="fa-solid fa-utensils"></i>
            <span>{product.dishes || "8 món"}</span>
          </div>
          <div className="restaurant-detail-item">
            <i className="fa-regular fa-clock"></i>
            <span>{product.time || "30-45 phút"}</span>
          </div>
          <div className="restaurant-detail-item">
            <i className="fa-solid fa-wallet"></i>
            <span>Tối thiểu: {product.price}</span>
          </div>
        </div>

        <div className="restaurant-actions">
          <button className="btn-view-menu" onClick={(e) => { e.stopPropagation(); handleViewRestaurant(); }}>
            <i className="fa-solid fa-store"></i> Xem nhà hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
