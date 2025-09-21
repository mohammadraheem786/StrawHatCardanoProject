const mongoose = require('mongoose');

const stakingPoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pool name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Pool name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Pool description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  apy: {
    type: Number,
    required: [true, 'APY is required'],
    min: [0, 'APY cannot be negative'],
    max: [10000, 'APY cannot exceed 10000%']
  },
  minStake: {
    type: Number,
    required: [true, 'Minimum stake is required'],
    min: [1, 'Minimum stake must be at least 1 ADA']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: [1000, 'Maximum capacity must be at least 1000 ADA']
  },
  totalStaked: {
    type: Number,
    default: 0,
    min: [0, 'Total staked cannot be negative']
  },
  totalStakers: {
    type: Number,
    default: 0,
    min: [0, 'Total stakers cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deprecated'],
    default: 'active'
  },
  createdBy: {
    type: String,
    required: [true, 'Creator address is required']
  },
  contractAddress: {
    type: String,
    default: null
  },
  features: [{
    type: String,
    enum: ['auto-compound', 'nft-bonus', 'governance-voting', 'early-access']
  }],
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for capacity utilization percentage
stakingPoolSchema.virtual('utilizationPercentage').get(function() {
  return Math.round((this.totalStaked / this.maxCapacity) * 100);
});

// Virtual for available capacity
stakingPoolSchema.virtual('availableCapacity').get(function() {
  return Math.max(0, this.maxCapacity - this.totalStaked);
});

// Index for efficient queries
stakingPoolSchema.index({ status: 1, apy: -1 });
stakingPoolSchema.index({ createdBy: 1 });
stakingPoolSchema.index({ totalStaked: -1 });

// Pre-save middleware
stakingPoolSchema.pre('save', function(next) {
  if (this.totalStaked > this.maxCapacity) {
    next(new Error('Total staked cannot exceed maximum capacity'));
  }
  next();
});

module.exports = mongoose.model('StakingPool', stakingPoolSchema);