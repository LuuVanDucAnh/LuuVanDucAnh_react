type Product = {
  name: string;
  price: number;
  image: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px" }}>
      <img src={product.image} alt={product.name} width="100" />
      <h3>{product.name}</h3>
      <p>{product.price}đ</p>
    </div>
  );
};

export default ProductCard;