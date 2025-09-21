const express = require('express');
const router = express.Router();
const stakingController = require('../controllers/stakingController');
const auth = require('../middleware/auth');

// Public routes
router.get('/stats', stakingController.getStakingStats);
router.get('/pools', stakingController.getStakingPools);

// Protected routes (require wallet connection)
router.post('/stake', auth, stakingController.createStake);
router.post('/unstake', auth, stakingController.unstake);
router.post('/claim-rewards', auth, stakingController.claimRewards);
router.get('/user/:address', auth, stakingController.getUserStakes);

// Admin routes
router.post('/create-pool', auth, stakingController.createStakingPool);
router.put('/update-pool/:id', auth, stakingController.updateStakingPool);

module.exports = router;