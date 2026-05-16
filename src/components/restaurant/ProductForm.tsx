import React, { useState } from 'react';

interface ProductFormProps {
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
  loading: boolean;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  newProduct,
  editingProduct,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="add-product-section">
      <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
      <form className="add-product-form" onSubmit={onSubmit}>
        <select
          value={newProduct.maDanhMuc}
          onChange={(e) => onChange('maDanhMuc', Number(e.target.value))}
        >
          {categories.map(c => (
            <option key={c.MaDanhMuc} value={c.MaDanhMuc}>{c.TenDanhMuc}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tên món"
          value={newProduct.tenMon}
          onChange={(e) => onChange('tenMon', e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Giá (VNĐ)"
          value={newProduct.gia}
          onChange={(e) => onChange('gia', e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Số lượng tồn"
          value={newProduct.soLuong}
          onChange={(e) => onChange('soLuong', Number(e.target.value) || 0)}
        />
        <input
          type="text"
          placeholder="Link hình ảnh"
          value={newProduct.hinhAnh}
          onChange={(e) => onChange('hinhAnh', e.target.value)}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={newProduct.moTa}
          onChange={(e) => onChange('moTa', e.target.value)}
        />
        <button type="submit" disabled={loading}>
          <i className="fa-solid fa-save"></i> {loading ? "Đang lưu..." : (editingProduct ? "Cập nhật" : "Thêm món")}
        </button>
        {editingProduct && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Hủy
          </button>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
