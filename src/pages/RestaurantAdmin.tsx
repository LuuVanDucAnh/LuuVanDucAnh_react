import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { restaurantService, adminService } from "../services/apiService";
import { getImageUrl } from "../utils/image";
import "../assets/css/style_restaurant_admin.css";

const RestaurantAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    tenMon: "",
    gia: "",
    hinhAnh: "",
    moTa: "",
    maDanhMuc: 1,
    soLuong: 100,
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderFilter, setOrderFilter] = useState("all");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
      fetchCategories();
    } else {
      fetchOrders();
    }
  }, [activeTab, orderFilter]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await adminService.getFoodsAdmin();
      setProducts(res.foods || []);
    } catch (error) {
      console.error("Lỗi khi tải món ăn:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminService.getCategories();
      setCategories(res.categories || []);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const params: any = { limit: 100 };
      if (orderFilter !== "all") params.status = orderFilter;
      const res = await restaurantService.getOrders(params);
      setOrders(res.orders || []);
      setOrdersTotal(res.total || 0);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        tenMon: newProduct.tenMon,
        gia: parseFloat(newProduct.gia),
        moTa: newProduct.moTa,
        hinhAnh: newProduct.hinhAnh,
        maDanhMuc: parseInt(String(newProduct.maDanhMuc)),
        soLuong: parseInt(String(newProduct.soLuong)) || 100,
      };

      if (editingProduct) {
        await adminService.updateFood(editingProduct.MaMonAn, payload);
      } else {
        await adminService.createFood(payload);
      }

      alert(editingProduct ? "Cập nhật món ăn thành công!" : "Thêm món ăn thành công!");
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setNewProduct({ tenMon: "", gia: "", hinhAnh: "", moTa: "", maDanhMuc: 1, soLuong: 100 });
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi lưu món ăn!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) return;
    try {
      await adminService.deleteFood(id);
      alert("Xóa món ăn thành công!");
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi xóa!");
    }
  };

  const handleConfirmOrder = async (orderId: number) => {
    if (!window.confirm("Xác nhận đơn hàng này?")) return;
    try {
      await restaurantService.confirmOrder(orderId);
      alert("Xác nhận đơn thành công!");
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi xác nhận!");
    }
  };

  const handleReadyOrder = async (orderId: number) => {
    if (!window.confirm("Đơn đã chuẩn bị xong?")) return;
    try {
      await restaurantService.readyOrder(orderId);
      alert("Đơn sẵn sàng giao!");
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    const lyDo = window.prompt("Lý do từ chối:");
    if (lyDo === null) return;
    try {
      await restaurantService.rejectOrder(orderId, lyDo);
      alert("Đã từ chối đơn hàng!");
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi từ chối!");
    }
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      tenMon: product.TenMon,
      gia: String(product.Gia),
      hinhAnh: product.HinhAnh || "",
      moTa: product.MoTa || "",
      maDanhMuc: product.MaDanhMuc,
      soLuong: product.SoLuong || 100,
    });
    setIsProductModalOpen(true);
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      ChoXacNhan: 'Chờ xác nhận',
      DaXacNhan: 'Đã xác nhận',
      DangChuanBi: 'Đang chuẩn bị',
      SanSangGiao: 'Sẵn sàng giao',
      DangGiao: 'Đang giao',
      DaGiao: 'Đã giao',
      Huy: 'Đã hủy',
    };
    return map[status] || status;
  };

  const pendingCount = orders.filter(o => o.TrangThai === 'ChoXacNhan').length;

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="restaurant-tabs">
            <button
              className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <i className="fa-solid fa-burger"></i> Quản lý sản phẩm
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="fa-solid fa-clipboard-list"></i> Quản lý đơn hàng
              {pendingCount > 0 && (
                <span className="notification-badge">{pendingCount}</span>
              )}
            </button>
          </div>

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="tab-content active">
              <div className="product-manager">
                <h2><i className="fa-solid fa-burger"></i> Quản lý sản phẩm</h2>

                <div className="add-product-section">
                  <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                  <form className="add-product-form" onSubmit={handleSaveProduct}>
                    <select
                      value={newProduct.maDanhMuc}
                      onChange={(e) => setNewProduct({ ...newProduct, maDanhMuc: Number(e.target.value) })}
                    >
                      {categories.map(c => (
                        <option key={c.MaDanhMuc} value={c.MaDanhMuc}>{c.TenDanhMuc}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Tên món"
                      value={newProduct.tenMon}
                      onChange={(e) => setNewProduct({ ...newProduct, tenMon: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Giá (VNĐ)"
                      value={newProduct.gia}
                      onChange={(e) => setNewProduct({ ...newProduct, gia: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Số lượng tồn"
                      value={newProduct.soLuong}
                      onChange={(e) => setNewProduct({ ...newProduct, soLuong: Number(e.target.value) || 0 })}
                    />
                    <input
                      type="text"
                      placeholder="Link hình ảnh"
                      value={newProduct.hinhAnh}
                      onChange={(e) => setNewProduct({ ...newProduct, hinhAnh: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Mô tả"
                      value={newProduct.moTa}
                      onChange={(e) => setNewProduct({ ...newProduct, moTa: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>
                      <i className="fa-solid fa-save"></i> {loading ? "Đang lưu..." : (editingProduct ? "Cập nhật" : "Thêm món")}
                    </button>
                    {editingProduct && (
                      <button type="button" className="btn-secondary" onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({ tenMon: "", gia: "", hinhAnh: "", moTa: "", maDanhMuc: 1, soLuong: 100 });
                        setIsProductModalOpen(false);
                      }}>
                        Hủy
                      </button>
                    )}
                  </form>
                </div>

                <h3>Danh sách sản phẩm hiện có ({products.length})</h3>
                {productsLoading ? (
                  <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>Đang tải...</p>
                ) : products.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>Chưa có sản phẩm nào.</p>
                ) : (
                  <div id="product-list">
                    {products.map(product => (
                      <div className="product_item" key={product.MaMonAn}>
                        <div className="img-box">
                          <img
                            src={getImageUrl(product.HinhAnh)}
                            alt={product.TenMon}
                          />
                        </div>
                        <div className="name-box"><strong>{product.TenMon}</strong></div>
                        <div className="price-box">{Number(product.Gia).toLocaleString("vi-VN")}đ</div>
                        <div className="desc-box">
                          <em>Tồn kho: {product.SoLuong || 0}</em> | <em>{product.MoTa || product.TenDanhMuc}</em>
                        </div>
                        <div className="btn-box">
                          <button onClick={() => openEditProduct(product)}><i className="fa-solid fa-pen"></i> Sửa</button>
                          <button className="btn-danger" onClick={() => handleDeleteProduct(product.MaMonAn)}><i className="fa-solid fa-trash"></i> Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="tab-content active">
              <div className="order-manager">
                <h2><i className="fa-solid fa-clipboard-list"></i> Quản lý đơn hàng</h2>
                <div className="order-filters">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "ChoXacNhan", label: "Chờ xác nhận" },
                    { id: "DangChuanBi", label: "Đang chuẩn bị" },
                    { id: "SanSangGiao", label: "Sẵn sàng" },
                    { id: "DangGiao", label: "Đang giao" },
                    { id: "DaGiao", label: "Đã giao" },
                    { id: "Huy", label: "Đã hủy" },
                  ].map(f => (
                    <button
                      key={f.id}
                      className={`filter-btn ${orderFilter === f.id ? "active" : ""}`}
                      onClick={() => setOrderFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div id="orders-list" className="orders-list">
                  {ordersLoading ? (
                    <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>Đang tải...</p>
                  ) : orders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>Không tìm thấy đơn hàng nào.</p>
                  ) : (
                    orders.map(order => (
                      <div className="restaurant-order-card" key={order.MaDonHang}>
                        <div className="order-header">
                          <strong><i className="fa-solid fa-receipt"></i> #{order.MaDonHang}</strong>
                          <span className={`order-status status-${order.TrangThai?.toLowerCase()}`}>
                            {getStatusLabel(order.TrangThai)}
                          </span>
                        </div>
                        <div className="order-info">
                          <div className="info-row">
                            <i className="fa-solid fa-user"></i>
                            <span>{order.TenKhachHang || order.MaKhachHang} - {order.KhachHangSDT || ''}</span>
                          </div>
                          <div className="info-row">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>Địa chỉ: {order.DiaChiGiao}</span>
                          </div>
                          <div className="info-row">
                            <i className="fa-solid fa-clock"></i>
                            <span>Ngày đặt: {new Date(order.NgayDat).toLocaleString()}</span>
                          </div>
                          {order.GhiChu && (
                            <div className="info-row">
                              <i className="fa-solid fa-sticky-note"></i>
                              <span>Ghi chú: {order.GhiChu}</span>
                            </div>
                          )}
                        </div>
                        <div className="order-footer">
                          <div className="order-total">
                            Tổng cộng: <span>{Number(order.TongTien).toLocaleString("vi-VN")} VNĐ</span>
                          </div>
                          <div className="order-actions">
                            {order.TrangThai === 'ChoXacNhan' && (
                              <>
                                <button className="btn-action btn-confirm" onClick={() => handleConfirmOrder(order.MaDonHang)}>
                                  <i className="fa-solid fa-check"></i> Xác nhận & Chuẩn bị
                                </button>
                                <button className="btn-action btn-danger" onClick={() => handleRejectOrder(order.MaDonHang)}>
                                  <i className="fa-solid fa-xmark"></i> Từ chối
                                </button>
                              </>
                            )}
                            {order.TrangThai === 'DangChuanBi' && (
                              <button className="btn-action btn-ready" onClick={() => handleReadyOrder(order.MaDonHang)}>
                                <i className="fa-solid fa-bell"></i> Sẵn sàng giao
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantAdmin;
