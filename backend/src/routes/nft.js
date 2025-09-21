const express = require('express');
const router = express.Router();

// NFT marketplace routes
router.get('/collections', async (req, res) => {
  try {
    const collections = [
      {
        id: 'strawhat-crew',
        name: 'Straw Hat Crew',
        description: 'Original crew member NFTs with special staking bonuses',
        totalSupply: 1000,
        floorPrice: 100,
        volume24h: 50000
      },
      {
        id: 'devil-fruits',
        name: 'Devil Fruits',
        description: 'Rare Devil Fruit NFTs that provide unique abilities',
        totalSupply: 500,
        floorPrice: 250,
        volume24h: 75000
      }
    ];

    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT collections'
    });
  }
});

router.get('/marketplace', async (req, res) => {
  try {
    const nfts = [
      {
        id: 'nft-001',
        name: 'Monkey D. Luffy',
        collection: 'Straw Hat Crew',
        price: 150,
        rarity: 'Legendary',
        stakingBonus: 2.5,
        image: 'https://via.placeholder.com/300x300?text=Luffy'
      },
      {
        id: 'nft-002',
        name: 'Roronoa Zoro',
        collection: 'Straw Hat Crew',
        price: 120,
        rarity: 'Epic',
        stakingBonus: 2.0,
        image: 'https://via.placeholder.com/300x300?text=Zoro'
      }
    ];

    res.json({
      success: true,
      data: nfts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT marketplace'
    });
  }
});

module.exports = router;