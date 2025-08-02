const express = require('express');
const router = express.Router();

// Mock users data
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@affilimart.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Merchant User',
    email: 'merchant@affilimart.com',
    role: 'merchant',
    status: 'active',
    createdAt: '2024-01-02'
  },
  {
    id: 3,
    name: 'Blogger User',
    email: 'blogger@affilimart.com',
    role: 'blogger',
    status: 'active',
    createdAt: '2024-01-03'
  }
];

// Get all users
router.get('/', (req, res) => {
  const { role, status, search } = req.query;
  
  let filteredUsers = [...users];

  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }

  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    users: filteredUsers,
    total: filteredUsers.length
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Create new user
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// Update user
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, role, status } = req.body;
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    role: role || users[userIndex].role,
    status: status || users[userIndex].status
  };

  res.json(users[userIndex]);
});

// Delete user
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.json({ message: 'User deleted successfully' });
});

module.exports = router; 