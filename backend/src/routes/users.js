const express = require('express');
const router = express.Router();

// Basic user routes for the demo
router.get('/profile/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Simulate user profile data
    const userProfile = {
      address,
      joinDate: new Date('2024-01-01'),
      totalStaked: 50000,
      totalRewards: 2500,
      activeStakes: 3,
      nftsOwned: 7,
      tier: 'Gold Straw Hat'
    };

    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    // Simulate leaderboard data
    const leaderboard = [
      { address: 'addr1...luffy', totalStaked: 1000000, rewards: 50000, rank: 1 },
      { address: 'addr1...zoro', totalStaked: 950000, rewards: 47500, rank: 2 },
      { address: 'addr1...sanji', totalStaked: 900000, rewards: 45000, rank: 3 },
      { address: 'addr1...nami', totalStaked: 850000, rewards: 42500, rank: 4 },
      { address: 'addr1...robin', totalStaked: 800000, rewards: 40000, rank: 5 }
    ];

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

module.exports = router;