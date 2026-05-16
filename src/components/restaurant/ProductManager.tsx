import React from 'react';
import ProductItem from './ProductItem';
import ProductForm from './ProductForm';

interface ProductManagerProps {
  products: any[];
  categories: any[];
  newProduct: {
    tenMon: string;
    gia: string;
    hinhAnh: string;
    moTa: string;
    maDanhMuc: number;
    soLuong: number;
  };
  editingProduct: any;
  productsLoading: boolean;
  loading: boolean;
  onProductChange: (field: string, value: any) => void;
  onSaveProduct: (e: React.FormEvent) => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: number) => void;
  onCancelEdit: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categories,
  newProduct,
  editingProduct,
  productsLoading,
  loading,
  onProductChange,
  onSaveProduct,
  onEditProduct,
  onDeleteProduct,
  onCancelEdit,
}) => {
  return (
    <div className="product-manager">
      <h2><i className="fa-solid fa-burger"></i> Quản lý sản phẩm</h2>

      <ProductForm
        categories={categories}
        newProduct={newProduct}
        editingProduct={editingProduct}
        loading={loading}
        onChange={onProductChange}
        onSubmit={onSaveProduct}
        onCancel={onCancelEdit}
      />

      <h3>Danh sách sản phẩm hiện có ({products.length})</h3>
      {productsLoading ? (
        <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>Đang tải...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>Chưa có sản phẩm nào.</p>
      ) : (
        <div id="product-list">
          {products.map(product => (
            <ProductItem
              key={product.MaMonAn}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
