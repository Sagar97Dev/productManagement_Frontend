import React from 'react';
import { Button, Container } from 'react-bootstrap';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';

const ProductManagementPage: React.FC = () => {
  return (
    <Container>
      <h1>Product Management</h1>
      <ProductList />
    </Container>
  );
};

export default ProductManagementPage;
