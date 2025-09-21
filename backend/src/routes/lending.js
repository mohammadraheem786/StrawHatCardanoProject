const express = require('express');
const router = express.Router();

// Lending protocol routes
router.get('/pools', async (req, res) => {
  try {
    const lendingPools = [
      {
        id: 'ada-lending-pool',
        asset: 'ADA',
        totalLiquidity: 5000000,
        borrowedAmount: 2000000,
        supplyAPY: 5.2,
        borrowAPY: 8.5,
        collateralRatio: 150
      },
      {
        id: 'djed-lending-pool',
        asset: 'DJED',
        totalLiquidity: 1000000,
        borrowedAmount: 400000,
        supplyAPY: 4.8,
        borrowAPY: 7.2,
        collateralRatio: 125
      }
    ];

    res.json({
      success: true,
      data: lendingPools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lending pools'
    });
  }
});

router.get('/user-positions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const positions = {
      supplied: [
        {
          asset: 'ADA',
          amount: 10000,
          apy: 5.2,
          earned: 520
        }
      ],
      borrowed: [
        {
          asset: 'DJED',
          amount: 5000,
          apy: 7.2,
          collateral: 7500,
          healthRatio: 150
        }
      ]
    };

    res.json({
      success: true,
      data: positions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user lending positions'
    });
  }
});

module.exports = router;