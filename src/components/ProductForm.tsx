import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection
import { toast } from 'react-toastify';

interface ProductFormProps {
  onSubmit: (data: any) => void;
  initialValues?: any; // For editing
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialValues = {} }) => {
  const navigate = useNavigate(); // Initialize useHistory hook
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  });

  const submitForm = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('image', data.image[0]); // Assuming image is a FileList
  
      
      // Submit form data to backend
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response, '<====resposne');
  
      if (response.status === 201) {
        navigate('/');
        toast.success('Product added successfully!');
        onSubmit(data); // Optional: Update parent component state or trigger a refresh
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error: any) {
      console.error('Error adding product:', error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || 'Failed to add product. Please try again later.');
    }
  };
  

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" {...register('name', { required: 'Name is required' })} />
      </Form.Group>

      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })} />
      </Form.Group>

      <Form.Group controlId="image">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" {...register('image', { required: 'Image is required' })} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ProductForm;
