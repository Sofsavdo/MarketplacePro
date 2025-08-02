const express = require('express');
const router = express.Router();

// Mock analytics data
const analytics = {
  platform: {
    totalRevenue: 125000000,
    totalOrders: 1250,
    totalUsers: 8500,
    totalProducts: 12500,
    revenueChange: 12.5,
    ordersChange: 8.3,
    usersChange: 15.2,
    productsChange: -2.1
  },
  merchants: {
    totalRevenue: 25000000,
    totalOrders: 45,
    totalViews: 1250,
    averageRating: 4.8,
    revenueChange: 15.2,
    ordersChange: 8.5,
    viewsChange: 12.3,
    ratingChange: 0.2
  },
  bloggers: {
    totalEarnings: 8500000,
    totalFollowers: 12500,
    totalConversions: 234,
    totalClicks: 5670,
    earningsChange: 18.5,
    followersChange: 12.3,
    conversionsChange: 8.7,
    clicksChange: 15.2
  }
};

// Get platform analytics
router.get('/platform', (req, res) => {
  res.json(analytics.platform);
});

// Get merchant analytics
router.get('/merchants', (req, res) => {
  res.json(analytics.merchants);
});

// Get blogger analytics
router.get('/bloggers', (req, res) => {
  res.json(analytics.bloggers);
});

// Get all analytics
router.get('/', (req, res) => {
  res.json(analytics);
});

// Get revenue trends
router.get('/revenue/trends', (req, res) => {
  const trends = [
    { date: '2024-01-01', revenue: 1000000 },
    { date: '2024-01-02', revenue: 1200000 },
    { date: '2024-01-03', revenue: 1100000 },
    { date: '2024-01-04', revenue: 1300000 },
    { date: '2024-01-05', revenue: 1400000 },
    { date: '2024-01-06', revenue: 1500000 },
    { date: '2024-01-07', revenue: 1600000 }
  ];

  res.json(trends);
});

// Get top products
router.get('/products/top', (req, res) => {
  const topProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      sales: 45,
      revenue: 675000000,
      commission: 33750000
    },
    {
      id: 2,
      name: 'MacBook Pro M3 Max',
      sales: 25,
      revenue: 625000000,
      commission: 31250000
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      sales: 120,
      revenue: 300000000,
      commission: 9000000
    }
  ];

  res.json(topProducts);
});

// Get top bloggers
router.get('/bloggers/top', (req, res) => {
  const topBloggers = [
    {
      id: 1,
      name: 'Blogger User',
      earnings: 8500000,
      conversions: 234,
      followers: 12500
    },
    {
      id: 2,
      name: 'Influencer Pro',
      earnings: 6500000,
      conversions: 189,
      followers: 9800
    },
    {
      id: 3,
      name: 'Content Creator',
      earnings: 4500000,
      conversions: 156,
      followers: 7200
    }
  ];

  res.json(topBloggers);
});

module.exports = router; 