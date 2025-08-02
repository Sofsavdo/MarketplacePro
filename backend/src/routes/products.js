const express = require('express');
const router = express.Router();

// Mock products data
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'Electronics',
    price: 15000000,
    originalPrice: 16000000,
    description: 'Eng yangi iPhone modeli, A17 Pro chip bilan',
    merchant: 'Apple Store Tashkent',
    status: 'active',
    stock: 50,
    rating: 4.8,
    reviews: 1250,
    commission: 5.0,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'MacBook Pro M3 Max',
    category: 'Electronics',
    price: 25000000,
    originalPrice: 27000000,
    description: 'Kuchli M3 Max chip bilan MacBook Pro',
    merchant: 'Apple Store Tashkent',
    status: 'active',
    stock: 25,
    rating: 4.9,
    reviews: 567,
    commission: 5.0,
    createdAt: '2024-01-02'
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    category: 'Electronics',
    price: 2500000,
    originalPrice: 2800000,
    description: 'Noise cancellation bilan AirPods Pro',
    merchant: 'Apple Store Tashkent',
    status: 'active',
    stock: 100,
    rating: 4.7,
    reviews: 890,
    commission: 3.0,
    createdAt: '2024-01-03'
  }
];

// Get all products
router.get('/', (req, res) => {
  const { category, status, search, minPrice, maxPrice } = req.query;
  
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  if (status) {
    filteredProducts = filteredProducts.filter(product => product.status === status);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseInt(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseInt(maxPrice));
  }

  res.json({
    products: filteredProducts,
    total: filteredProducts.length
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Create new product
router.post('/', (req, res) => {
  const { name, category, price, originalPrice, description, merchant, stock, commission } = req.body;

  if (!name || !category || !price || !description || !merchant) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    category,
    price: parseInt(price),
    originalPrice: parseInt(originalPrice) || parseInt(price),
    description,
    merchant,
    status: 'active',
    stock: parseInt(stock) || 0,
    rating: 0,
    reviews: 0,
    commission: parseFloat(commission) || 0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// Update product
router.put('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, category, price, originalPrice, description, merchant, stock, status, commission } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    category: category || products[productIndex].category,
    price: price ? parseInt(price) : products[productIndex].price,
    originalPrice: originalPrice ? parseInt(originalPrice) : products[productIndex].originalPrice,
    description: description || products[productIndex].description,
    merchant: merchant || products[productIndex].merchant,
    stock: stock ? parseInt(stock) : products[productIndex].stock,
    status: status || products[productIndex].status,
    commission: commission ? parseFloat(commission) : products[productIndex].commission
  };

  res.json(products[productIndex]);
});

// Delete product
router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);

  res.json({ message: 'Product deleted successfully' });
});

module.exports = router; 