import React from 'react';
import { getImageUrl } from '../../utils/image';

interface ProductItemProps {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (id: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product_item" key={product.MaMonAn}>
      <div className="img-box">
        <img src={getImageUrl(product.HinhAnh)} alt={product.TenMon} />
      </div>
      <div className="name-box"><strong>{product.TenMon}</strong></div>
      <div className="price-box">{Number(product.Gia).toLocaleString("vi-VN")}đ</div>
      <div className="desc-box">
        <em>Tồn kho: {product.SoLuong || 0}</em> | <em>{product.MoTa || product.TenDanhMuc}</em>
      </div>
      <div className="btn-box">
        <button onClick={() => onEdit(product)}><i className="fa-solid fa-pen"></i> Sửa</button>
        <button className="btn-danger" onClick={() => onDelete(product.MaMonAn)}><i className="fa-solid fa-trash"></i> Xóa</button>
      </div>
    </div>
  );
};

export default ProductItem;
