type Product = {
  name: string;
  price: number;
  image: string;
};

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <div className="product_card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}đ</p>
    </div>
  );
};

export default ProductCard;