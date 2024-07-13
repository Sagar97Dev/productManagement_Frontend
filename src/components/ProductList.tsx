import React, { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FcNumericalSorting21 } from "react-icons/fc";
import ReactPaginate from 'react-paginate';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  createdAt: Date;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0); // Start at page 0
  const [productsPerPage] = useState<number>(5); // Number of products per page
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [sortBy, setSortBy] = useState<keyof Product>('createdAt');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, order]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<{ rows: Product[], count: number }>('http://localhost:5000/api/products', {
        params: {
          name: searchTerm,
          startDate,
          endDate,
          sortBy,
          order,
          page: currentPage + 1, // Backend expects 1-based page number
          pageSize: productsPerPage
        }
      });
      if (Array.isArray(response.data.rows)) {
        setProducts(response.data.rows);
        setTotalProducts(response.data.count);
      } else {
        console.error('API response does not contain rows as an array:', response.data);
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalProducts(0);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page after filtering
    fetchProducts();
  };

  const handleSort = (column: keyof Product) => {
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(column);
    setOrder(newOrder);
  };

  // Pagination
  const pageCount = Math.ceil(totalProducts / productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={handleSearch}>Apply Filters</Button>
          {' '}
          <Button><Link to="/add-product" className="text-white">Add Product</Link></Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th onClick={() => handleSort('createdAt')}>
              Creation Date
              <FcNumericalSorting21 style={{ marginBottom: '10px', cursor: 'pointer' }} />
            </th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td><img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ maxWidth: '100px', maxHeight: '100px' }} /></td>
              <td>{product.price}</td>
              <td>{new Date(product.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/edit-product/${product.id}`} className="btn btn-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </>
  );
};

export default ProductList;
