type Props = {
  product: {
    name: string;
    price: number;
    image: string;
  };
};

const ProductCard = ({ product }: Props) => {
  return (
    <div className="product_item">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()} VNĐ</p>

      <button>
        <i className="fa-solid fa-cart-shopping"></i>
        Đặt hàng
      </button>
    </div>
  );
};

export default ProductCard;