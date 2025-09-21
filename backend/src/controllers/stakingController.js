const Stake = require('../models/Stake');
const StakingPool = require('../models/StakingPool');
const cardanoService = require('../services/cardanoService');
const logger = require('../utils/logger');

// Get staking statistics
exports.getStakingStats = async (req, res) => {
  try {
    const totalStaked = await Stake.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRewards = await Stake.aggregate([
      { $group: { _id: null, total: { $sum: '$totalRewards' } } }
    ]);

    const activeStakers = await Stake.distinct('userAddress', { status: 'active' });
    const totalPools = await StakingPool.countDocuments({ status: 'active' });

    res.json({
      success: true,
      data: {
        totalStaked: totalStaked[0]?.total || 0,
        totalRewards: totalRewards[0]?.total || 0,
        activeStakers: activeStakers.length,
        totalPools
      }
    });
  } catch (error) {
    logger.error('Error fetching staking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staking statistics'
    });
  }
};

// Get available staking pools
exports.getStakingPools = async (req, res) => {
  try {
    const pools = await StakingPool.find({ status: 'active' })
      .select('name description apy minStake totalStaked maxCapacity')
      .sort({ apy: -1 });

    res.json({
      success: true,
      data: pools
    });
  } catch (error) {
    logger.error('Error fetching staking pools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staking pools'
    });
  }
};

// Create a new stake
exports.createStake = async (req, res) => {
  try {
    const { amount, poolId, txHash } = req.body;
    const userAddress = req.user.address;

    // Validate transaction on Cardano network
    const isValidTx = await cardanoService.validateTransaction(txHash);
    if (!isValidTx) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction hash'
      });
    }

    // Check if pool exists and has capacity
    const pool = await StakingPool.findById(poolId);
    if (!pool || pool.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Staking pool not found or inactive'
      });
    }

    if (amount < pool.minStake) {
      return res.status(400).json({
        success: false,
        message: `Minimum stake amount is ${pool.minStake} ADA`
      });
    }

    if (pool.totalStaked + amount > pool.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Pool capacity exceeded'
      });
    }

    // Create stake record
    const stake = new Stake({
      userAddress,
      poolId,
      amount,
      txHash,
      startDate: new Date(),
      apy: pool.apy,
      status: 'active'
    });

    await stake.save();

    // Update pool statistics
    await StakingPool.findByIdAndUpdate(poolId, {
      $inc: { 
        totalStaked: amount,
        totalStakers: 1
      }
    });

    logger.info(`New stake created: ${amount} ADA by ${userAddress}`);

    res.status(201).json({
      success: true,
      message: 'Stake created successfully',
      data: stake
    });
  } catch (error) {
    logger.error('Error creating stake:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create stake'
    });
  }
};

// Unstake tokens
exports.unstake = async (req, res) => {
  try {
    const { stakeId, amount, txHash } = req.body;
    const userAddress = req.user.address;

    const stake = await Stake.findOne({
      _id: stakeId,
      userAddress,
      status: 'active'
    });

    if (!stake) {
      return res.status(404).json({
        success: false,
        message: 'Active stake not found'
      });
    }

    // Check lock period
    const lockPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - stake.startDate.getTime() < lockPeriod) {
      return res.status(400).json({
        success: false,
        message: 'Tokens are still in lock period'
      });
    }

    // Validate transaction
    const isValidTx = await cardanoService.validateTransaction(txHash);
    if (!isValidTx) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction hash'
      });
    }

    // Calculate rewards before unstaking
    const rewards = await cardanoService.calculateRewards(stake);

    // Update stake
    if (amount >= stake.amount) {
      // Full unstake
      stake.status = 'completed';
      stake.endDate = new Date();
      stake.unstakeTxHash = txHash;
    } else {
      // Partial unstake
      stake.amount -= amount;
    }

    stake.totalRewards += rewards;
    await stake.save();

    // Update pool statistics
    await StakingPool.findByIdAndUpdate(stake.poolId, {
      $inc: { 
        totalStaked: -amount,
        totalStakers: stake.status === 'completed' ? -1 : 0
      }
    });

    res.json({
      success: true,
      message: 'Unstake successful',
      data: {
        unstakedAmount: amount,
        rewards,
        remainingStake: stake.amount
      }
    });
  } catch (error) {
    logger.error('Error unstaking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unstake tokens'
    });
  }
};

// Claim rewards
exports.claimRewards = async (req, res) => {
  try {
    const { stakeId, txHash } = req.body;
    const userAddress = req.user.address;

    const stake = await Stake.findOne({
      _id: stakeId,
      userAddress,
      status: 'active'
    });

    if (!stake) {
      return res.status(404).json({
        success: false,
        message: 'Active stake not found'
      });
    }

    // Calculate available rewards
    const rewards = await cardanoService.calculateRewards(stake);

    if (rewards <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No rewards available to claim'
      });
    }

    // Validate transaction
    const isValidTx = await cardanoService.validateTransaction(txHash);
    if (!isValidTx) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction hash'
      });
    }

    // Update stake
    stake.totalRewards += rewards;
    stake.lastRewardClaim = new Date();
    stake.rewardTxHashes.push(txHash);
    await stake.save();

    logger.info(`Rewards claimed: ${rewards} ADA by ${userAddress}`);

    res.json({
      success: true,
      message: 'Rewards claimed successfully',
      data: {
        rewards,
        txHash,
        totalRewards: stake.totalRewards
      }
    });
  } catch (error) {
    logger.error('Error claiming rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim rewards'
    });
  }
};

// Get user stakes
exports.getUserStakes = async (req, res) => {
  try {
    const { address } = req.params;
    
    const stakes = await Stake.find({ userAddress: address })
      .populate('poolId', 'name apy')
      .sort({ startDate: -1 });

    const summary = {
      totalStaked: stakes.reduce((sum, stake) => 
        stake.status === 'active' ? sum + stake.amount : sum, 0),
      totalRewards: stakes.reduce((sum, stake) => sum + stake.totalRewards, 0),
      activeStakes: stakes.filter(stake => stake.status === 'active').length
    };

    res.json({
      success: true,
      data: {
        stakes,
        summary
      }
    });
  } catch (error) {
    logger.error('Error fetching user stakes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stakes'
    });
  }
};

// Create staking pool (admin only)
exports.createStakingPool = async (req, res) => {
  try {
    const { name, description, apy, minStake, maxCapacity } = req.body;

    const pool = new StakingPool({
      name,
      description,
      apy,
      minStake,
      maxCapacity,
      totalStaked: 0,
      totalStakers: 0,
      status: 'active',
      createdBy: req.user.address
    });

    await pool.save();

    res.status(201).json({
      success: true,
      message: 'Staking pool created successfully',
      data: pool
    });
  } catch (error) {
    logger.error('Error creating staking pool:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create staking pool'
    });
  }
};

// Update staking pool (admin only)
exports.updateStakingPool = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const pool = await StakingPool.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Staking pool not found'
      });
    }

    res.json({
      success: true,
      message: 'Staking pool updated successfully',
      data: pool
    });
  } catch (error) {
    logger.error('Error updating staking pool:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update staking pool'
    });
  }
};