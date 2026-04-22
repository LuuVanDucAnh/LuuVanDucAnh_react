import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Cart from "./pages/cart";
import RestaurantDetail from "./pages/RestaurantDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/restaurant" element={<RestaurantDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
