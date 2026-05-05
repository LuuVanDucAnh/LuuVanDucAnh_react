import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "../utils/api";
import "../assets/css/style_restaurant_admin.css";

// Interface cho sản phẩm của nhà hàng
interface RestaurantProduct {
  maMonAn: number;
  tenMon: string;
  gia: number;
  hinhAnh: string;
  moTa: string;
  maDanhMuc: number;
}

const RestaurantAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<RestaurantProduct[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State cho form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    tenMon: "",
    gia: "",
    hinhAnh: "",
    moTa: "",
    maDanhMuc: 1
  });

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      if (user.maNhaHang) {
        fetchRestaurantData(user.maNhaHang);
      }
    }
  }, []);

  const fetchRestaurantData = async (maNhaHang: number) => {
    try {
      // 1. Load món ăn của quán
      const productRes = await axiosClient.get(`/foods/Food/nhahang/${maNhaHang}/monan`);
      setProducts(productRes.data);

      // 2. Load đơn hàng của quán
      const orderRes = await axiosClient.get('/orders/ManageOrder/merchant/list');
      if (orderRes.data.success) setOrders(orderRes.data.data);

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nhà hàng:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.tenMon || !newProduct.gia || !currentUser?.maNhaHang) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const productToAdd = {
        ...newProduct,
        gia: Number(newProduct.gia),
        maNhaHang: currentUser.maNhaHang
      };

      const res = await axiosClient.post('/foods/Food/Create-MonAn', productToAdd);
      alert("Thêm sản phẩm thành công!");
      fetchRestaurantData(currentUser.maNhaHang);
      setNewProduct({ tenMon: "", gia: "", hinhAnh: "", moTa: "", maDanhMuc: 1 });
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axiosClient.delete(`/foods/Food/Delete-MonAn/${id}`);
        alert("Đã xóa sản phẩm");
        fetchRestaurantData(currentUser.maNhaHang);
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  const updateOrderStatus = async (orderId: number, endpoint: string) => {
    try {
      const res = await axiosClient.put(`/orders/ManageOrder/${orderId}/${endpoint}`);
      if (res.data.success) {
        alert("Cập nhật trạng thái thành công!");
        fetchRestaurantData(currentUser.maNhaHang);
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const filteredOrders = orderFilter === "all" ? orders : orders.filter(o => o.trangThai === orderFilter);

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
              Quản lý sản phẩm
            </button>
            <button 
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`} 
              onClick={() => setActiveTab("orders")}
            >
              Quản lý đơn hàng
              {orders.filter(o => o.status === "new").length > 0 && (
                <span className="notification-badge">
                  {orders.filter(o => o.status === "new").length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Quản lý sản phẩm */}
          {activeTab === "products" && (
            <div className="tab-content active">
              <div className="product-manager">
                <h2>Quản lý sản phẩm</h2>
                
                <div className="add-product-section">
                  <h3>Thêm sản phẩm mới</h3>
                  <div className="add-product-form">
                    <select 
                      value={newProduct.maDanhMuc} 
                      onChange={(e) => setNewProduct({...newProduct, maDanhMuc: Number(e.target.value)})}
                    >
                      <option value="1">Món chính</option>
                      <option value="2">Món nước</option>
                      <option value="3">Đồ uống</option>
                      <option value="4">Ăn vặt</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Tên món" 
                      value={newProduct.tenMon}
                      onChange={(e) => setNewProduct({...newProduct, tenMon: e.target.value})}
                    />
                    <input 
                      type="number" 
                      placeholder="Giá (VNĐ)" 
                      value={newProduct.gia}
                      onChange={(e) => setNewProduct({...newProduct, gia: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Link ảnh" 
                      value={newProduct.hinhAnh}
                      onChange={(e) => setNewProduct({...newProduct, hinhAnh: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Mô tả ngắn" 
                      value={newProduct.moTa}
                      onChange={(e) => setNewProduct({...newProduct, moTa: e.target.value})}
                    />
                    <button onClick={handleAddProduct}>
                      <i className="fa-solid fa-plus"></i> Thêm sản phẩm
                    </button>
                  </div>
                </div>

                <h3>Danh sách sản phẩm hiện có</h3>
                <div id="product-list">
                  {products.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>Chưa có sản phẩm nào.</p>
                  ) : (
                    products.map(product => (
                      <div className="product_item" key={product.maMonAn}>
                        <div className="img-box">
                          <img src={product.hinhAnh?.startsWith('http') ? product.hinhAnh : require(`../images/anh-chung.jpg`)} alt={product.tenMon} />
                        </div>
                        <div className="name-box">
                          <strong>{product.tenMon}</strong>
                        </div>
                        <div className="price-box"> {product.gia?.toLocaleString("vi-VN")} VNĐ </div>
                        <div className="desc-box">
                          <em>{product.moTa}</em>
                        </div>
                        <div className="btn-box">
                          <button onClick={() => handleDeleteProduct(product.maMonAn)}>Xóa</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Quản lý đơn hàng */}
          {activeTab === "orders" && (
            <div className="tab-content active">
              <div className="order-manager">
                <h2>Quản lý đơn hàng</h2>
                <div className="order-filters">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "ChoXacNhan", label: "Chờ xác nhận" },
                    { id: "DangChuanBi", label: "Đang chuẩn bị" },
                    { id: "SanSangGiao", label: "Sẵn sàng" },
                    { id: "DangGiao", label: "Đang giao" },
                    { id: "DaGiao", label: "Đã giao" }
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
                  {filteredOrders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>Không tìm thấy đơn hàng nào.</p>
                  ) : (
                    filteredOrders.map(order => (
                      <div className="restaurant-order-card" key={order.maDonHang}>
                        <div className="order-header">
                          <strong><i className="fa-solid fa-receipt"></i> #{order.maDonHang}</strong>
                          <span className={`order-status status-${order.trangThai?.toLowerCase()}`}>{order.trangThai}</span>
                        </div>
                        
                        <div className="order-info">
                          <div className="info-row">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>Địa chỉ: {order.diaChiGiao}</span>
                          </div>
                          <div className="info-row">
                            <i className="fa-solid fa-clock"></i>
                            <span>Ngày đặt: {new Date(order.ngayDat).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            Tổng cộng: <span>{order.tongTien?.toLocaleString("vi-VN")} VNĐ</span>
                          </div>
                          
                          <div className="order-actions">
                            {order.trangThai === "ChoXacNhan" && (
                              <button className="btn-action btn-confirm" onClick={() => updateOrderStatus(order.maDonHang, "confirm")}>
                                <i className="fa-solid fa-check"></i> Xác nhận & Chuẩn bị
                              </button>
                            )}
                            {order.trangThai === "DangChuanBi" && (
                              <button className="btn-action btn-ready" onClick={() => updateOrderStatus(order.maDonHang, "ready")}>
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
