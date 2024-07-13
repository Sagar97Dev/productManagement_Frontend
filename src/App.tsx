import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddProductPage from './components/AddProductPage';
import ProductManagementPage from './components/ProductManagementPage';
import EditProductPage from './components/EditProduct';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/" element={<ProductManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
