import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getOrders, saveOrders, Order } from "../utils/order";
import "../assets/css/style_restaurant_admin.css";

// Interface cho sản phẩm của nhà hàng
interface RestaurantProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const RestaurantAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<RestaurantProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState("all");

  // State cho form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "mon_chay"
  });

  useEffect(() => {
    // Load sản phẩm
    const savedProducts = localStorage.getItem("restaurant_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Dữ liệu mẫu ban đầu
      const initialProducts = [
        { id: "p1", name: "Nấm sốt đông", price: 20000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6f9Y9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f", description: "Nấm đông có sốt với nước tương và gia vị", category: "mon_chay" }
      ];
      setProducts(initialProducts);
      localStorage.setItem("restaurant_products", JSON.stringify(initialProducts));
    }

    // Load đơn hàng
    setOrders(getOrders());
  }, []);

  const saveProductsToLocal = (updatedProducts: RestaurantProduct[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("restaurant_products", JSON.stringify(updatedProducts));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Vui lòng nhập tên và giá sản phẩm!");
      return;
    }

    const productToAdd: RestaurantProduct = {
      id: "P" + Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      image: newProduct.image || "https://via.placeholder.com/150",
      description: newProduct.description,
      category: newProduct.category
    };

    saveProductsToLocal([productToAdd, ...products]);
    setNewProduct({ name: "", price: "", image: "", description: "", category: "mon_chay" });
    alert("Thêm sản phẩm thành công!");
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const updated = products.filter(p => p.id !== id);
      saveProductsToLocal(updated);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    alert(`Đã cập nhật trạng thái đơn hàng sang: ${newStatus.toUpperCase()}`);
  };

  const filteredOrders = orderFilter === "all" ? orders : orders.filter(o => o.status === orderFilter);

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
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="mon_chay">Món chay</option>
                      <option value="mon_man">Món mặn</option>
                      <option value="mon_lau">Món lẩu</option>
                      <option value="an_vat">Ăn vặt</option>
                      <option value="nuoc_uong">Nước uống</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Tên món" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <input 
                      type="number" 
                      placeholder="Giá (VNĐ)" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Link ảnh" 
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Mô tả ngắn" 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
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
                      <div className="product_item" key={product.id}>
                        <div className="img-box">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="name-box">
                          <strong>{product.name}</strong>
                          <div style={{ fontSize: "12px", color: "#999", fontWeight: "normal" }}>{product.category}</div>
                        </div>
                        <div className="price-box"> {product.price.toLocaleString("vi-VN")} VNĐ </div>
                        <div className="desc-box">
                          <em>{product.description}</em>
                        </div>
                        <div className="btn-box">
                          <button onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
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
                    { id: "new", label: "Đơn mới" },
                    { id: "confirmed", label: "Đã xác nhận" },
                    { id: "preparing", label: "Đang chuẩn bị" },
                    { id: "ready", label: "Sẵn sàng giao" },
                    { id: "assigned", label: "Đang giao" },
                    { id: "completed", label: "Hoàn thành" }
                  ].map(filter => (
                    <button 
                      key={filter.id}
                      className={`filter-btn ${orderFilter === filter.id ? "active" : ""}`}
                      onClick={() => setOrderFilter(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div id="orders-list" className="orders-list">
                  {filteredOrders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>Không tìm thấy đơn hàng nào.</p>
                  ) : (
                    filteredOrders.map(order => (
                      <div className="restaurant-order-card" key={order.id}>
                        <div className="order-header">
                          <strong><i className="fa-solid fa-receipt"></i> #{order.id}</strong>
                          <span className={`order-status status-${order.status}`}>{order.status.toUpperCase()}</span>
                        </div>
                        
                        <div className="order-info">
                          <div className="info-row">
                            <i className="fa-solid fa-user"></i>
                            <span>Khách hàng: <strong>{order.customerName}</strong> - {order.phone}</span>
                          </div>
                          <div className="info-row">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>Địa chỉ: {order.address}</span>
                          </div>
                          <div className="info-row">
                            <i className="fa-solid fa-clock"></i>
                            <span>Thời gian đặt: {order.date}</span>
                          </div>
                          <div className="info-row">
                            <i className="fa-solid fa-comment-dots"></i>
                            <span>Ghi chú: {order.note || "Không có"}</span>
                          </div>
                        </div>

                        <div className="order-items">
                          <strong>Món ăn yêu cầu:</strong>
                          <ul>
                            {order.items.map((item, i) => (
                              <li key={i}>
                                <span>{item.name}</span>
                                <strong>x{item.quantity}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            Tổng doanh thu: <span>{order.total.toLocaleString("vi-VN")} VNĐ</span>
                          </div>
                          
                          <div className="order-actions">
                            {order.status === "new" && (
                              <>
                                <button className="btn-action btn-confirm" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                                  <i className="fa-solid fa-check"></i> Xác nhận
                                </button>
                                <button className="btn-action btn-cancel" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                                  <i className="fa-solid fa-xmark"></i> Hủy đơn
                                </button>
                              </>
                            )}
                            {order.status === "confirmed" && (
                              <button className="btn-action btn-preparing" onClick={() => updateOrderStatus(order.id, "preparing")}>
                                <i className="fa-solid fa-utensils"></i> Chuẩn bị món
                              </button>
                            )}
                            {order.status === "preparing" && (
                              <button className="btn-action btn-ready" onClick={() => updateOrderStatus(order.id, "ready")}>
                                <i className="fa-solid fa-bell"></i> Sẵn sàng giao
                              </button>
                            )}
                            {order.status === "ready" && (
                              <button className="btn-action btn-assign" onClick={() => updateOrderStatus(order.id, "assigned")}>
                                <i className="fa-solid fa-truck"></i> Giao cho Shipper
                              </button>
                            )}
                            {order.status === "assigned" && (
                              <button className="btn-action btn-confirm" onClick={() => updateOrderStatus(order.id, "completed")}>
                                <i className="fa-solid fa-check-double"></i> Hoàn thành
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
