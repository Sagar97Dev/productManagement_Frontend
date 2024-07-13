import React from 'react';
import { Container } from 'react-bootstrap';
import ProductForm from '../components/ProductForm';

const AddProductPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    // Handle form submission, e.g., send data to backend
    console.log(data);
  };

  return (
    <Container>
      <h1>Add Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default AddProductPage;
