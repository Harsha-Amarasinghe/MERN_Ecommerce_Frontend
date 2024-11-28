import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductForm from './components/ProductForm';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the main product list page */}
        <Route path="/" element={<ProductsPage />} />
        
        {/* Route for adding a new product */}
        <Route path="/add-product" element={<ProductForm />} />
        
        {/* Route for editing an existing product */}
        <Route path="/edit-product/:id" element={<ProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;
