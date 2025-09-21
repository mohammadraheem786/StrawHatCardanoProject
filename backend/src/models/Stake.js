const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: [true, 'User address is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic Cardano address validation
        return /^addr[a-z0-9]+$/.test(v) || /^stake[a-z0-9]+$/.test(v);
      },
      message: 'Invalid Cardano address format'
    }
  },
  poolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StakingPool',
    required: [true, 'Pool ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Stake amount is required'],
    min: [1, 'Stake amount must be at least 1 ADA']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  apy: {
    type: Number,
    required: [true, 'APY is required'],
    min: [0, 'APY cannot be negative']
  },
  totalRewards: {
    type: Number,
    default: 0,
    min: [0, 'Total rewards cannot be negative']
  },
  lastRewardClaim: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'liquidated'],
    default: 'active'
  },
  txHash: {
    type: String,
    required: [true, 'Transaction hash is required'],
    unique: true,
    validate: {
      validator: function(v) {
        // Basic transaction hash validation (64 character hex string)
        return /^[a-f0-9]{64}$/i.test(v);
      },
      message: 'Invalid transaction hash format'
    }
  },
  unstakeTxHash: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        if (v === null || v === undefined) return true;
        return /^[a-f0-9]{64}$/i.test(v);
      },
      message: 'Invalid unstake transaction hash format'
    }
  },
  rewardTxHashes: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^[a-f0-9]{64}$/i.test(v);
      },
      message: 'Invalid reward transaction hash format'
    }
  }],
  lockPeriodDays: {
    type: Number,
    default: 7,
    min: [0, 'Lock period cannot be negative']
  },
  autoCompound: {
    type: Boolean,
    default: false
  },
  nftBonusApplied: {
    type: Boolean,
    default: false
  },
  bonusMultiplier: {
    type: Number,
    default: 1.0,
    min: [1.0, 'Bonus multiplier cannot be less than 1.0'],
    max: [5.0, 'Bonus multiplier cannot exceed 5.0']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating days since stake started
stakeSchema.virtual('daysSinceStart').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for checking if lock period has passed
stakeSchema.virtual('isUnlocked').get(function() {
  return this.daysSinceStart >= this.lockPeriodDays;
});

// Virtual for calculating pending rewards (simplified)
stakeSchema.virtual('pendingRewards').get(function() {
  if (this.status !== 'active') return 0;
  
  const daysSinceLastClaim = this.lastRewardClaim 
    ? Math.ceil((new Date() - this.lastRewardClaim) / (1000 * 60 * 60 * 24))
    : this.daysSinceStart;
    
  const dailyRate = (this.apy * this.bonusMultiplier) / 365 / 100;
  return Math.floor((this.amount * dailyRate * daysSinceLastClaim) * 1000000) / 1000000; // 6 decimal precision
});

// Indexes for efficient queries
stakeSchema.index({ userAddress: 1, status: 1 });
stakeSchema.index({ poolId: 1, status: 1 });
stakeSchema.index({ status: 1, startDate: -1 });
stakeSchema.index({ txHash: 1 }, { unique: true });

// Pre-save middleware to set end date when status changes to completed
stakeSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.endDate) {
    this.endDate = new Date();
  }
  next();
});

// Static method to get user's total staked amount
stakeSchema.statics.getUserTotalStaked = function(userAddress) {
  return this.aggregate([
    { $match: { userAddress, status: 'active' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
};

// Static method to get pool statistics
stakeSchema.statics.getPoolStats = function(poolId) {
  return this.aggregate([
    { $match: { poolId: mongoose.Types.ObjectId(poolId), status: 'active' } },
    {
      $group: {
        _id: null,
        totalStaked: { $sum: '$amount' },
        totalStakers: { $sum: 1 },
        avgStakeAmount: { $avg: '$amount' },
        totalRewardsDistributed: { $sum: '$totalRewards' }
      }
    }
  ]);
};

module.exports = mongoose.model('Stake', stakeSchema);