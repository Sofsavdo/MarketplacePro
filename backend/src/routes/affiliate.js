const express = require('express');
const router = express.Router();

// Mock affiliate data
const affiliateLinks = [
  {
    id: 1,
    productId: 1,
    productName: 'iPhone 15 Pro Max',
    affiliateUrl: 'https://affilimart.com/ref/blogger123/iphone15',
    shortUrl: 'affilimart.com/iphone15',
    clicks: 1250,
    conversions: 45,
    earnings: 675000,
    commission: 5.0,
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    productId: 2,
    productName: 'MacBook Pro M3 Max',
    affiliateUrl: 'https://affilimart.com/ref/blogger123/macbook',
    shortUrl: 'affilimart.com/macbook',
    clicks: 890,
    conversions: 25,
    earnings: 625000,
    commission: 5.0,
    status: 'active',
    createdAt: '2024-01-08'
  }
];

const offers = [
  {
    id: 1,
    merchant: 'Apple Store Tashkent',
    product: 'iPhone 15 Pro Max',
    offer: 'Mahsulotni Instagram va TikTok da reklama qilish',
    commission: 150000,
    duration: '7 kun',
    requirements: [
      '10K+ obunachilar',
      'Professional kontent',
      'Hashtag #AppleStoreUZ',
      'Story va Reels'
    ],
    status: 'pending',
    deadline: '2024-01-20'
  }
];

// Get affiliate links
router.get('/links', (req, res) => {
  const { status, search } = req.query;
  
  let filteredLinks = [...affiliateLinks];

  if (status) {
    filteredLinks = filteredLinks.filter(link => link.status === status);
  }

  if (search) {
    filteredLinks = filteredLinks.filter(link => 
      link.productName.toLowerCase().includes(search.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    links: filteredLinks,
    total: filteredLinks.length
  });
});

// Create affiliate link
router.post('/links', (req, res) => {
  const { productId, productName } = req.body;

  if (!productId || !productName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newLink = {
    id: affiliateLinks.length + 1,
    productId,
    productName,
    affiliateUrl: `https://affilimart.com/ref/blogger123/${productName.toLowerCase().replace(/\s+/g, '')}`,
    shortUrl: `affilimart.com/${productName.toLowerCase().replace(/\s+/g, '')}`,
    clicks: 0,
    conversions: 0,
    earnings: 0,
    commission: 5.0,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  affiliateLinks.push(newLink);

  res.status(201).json(newLink);
});

// Get offers
router.get('/offers', (req, res) => {
  const { status } = req.query;
  
  let filteredOffers = [...offers];

  if (status) {
    filteredOffers = filteredOffers.filter(offer => offer.status === status);
  }

  res.json({
    offers: filteredOffers,
    total: filteredOffers.length
  });
});

// Accept offer
router.post('/offers/:id/accept', (req, res) => {
  const offerIndex = offers.findIndex(o => o.id === parseInt(req.params.id));
  
  if (offerIndex === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  offers[offerIndex].status = 'accepted';

  res.json(offers[offerIndex]);
});

// Reject offer
router.post('/offers/:id/reject', (req, res) => {
  const offerIndex = offers.findIndex(o => o.id === parseInt(req.params.id));
  
  if (offerIndex === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  offers[offerIndex].status = 'rejected';

  res.json(offers[offerIndex]);
});

// Get earnings
router.get('/earnings', (req, res) => {
  const totalEarnings = affiliateLinks.reduce((sum, link) => sum + link.earnings, 0);
  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
  const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0);

  res.json({
    totalEarnings,
    totalClicks,
    totalConversions,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : 0
  });
});

// Track click
router.post('/track/:linkId', (req, res) => {
  const linkIndex = affiliateLinks.findIndex(l => l.id === parseInt(req.params.linkId));
  
  if (linkIndex === -1) {
    return res.status(404).json({ error: 'Link not found' });
  }

  affiliateLinks[linkIndex].clicks += 1;

  res.json({ message: 'Click tracked successfully' });
});

// Track conversion
router.post('/convert/:linkId', (req, res) => {
  const linkIndex = affiliateLinks.findIndex(l => l.id === parseInt(req.params.linkId));
  
  if (linkIndex === -1) {
    return res.status(404).json({ error: 'Link not found' });
  }

  affiliateLinks[linkIndex].conversions += 1;
  affiliateLinks[linkIndex].earnings += 15000; // Example commission

  res.json({ message: 'Conversion tracked successfully' });
});

module.exports = router; 