// Middleware to handle authentication
const auth = (req, res, next) => {
  // For demo purposes, we'll simulate wallet authentication
  // In production, this would validate wallet signatures
  const walletAddress = req.headers['x-wallet-address'];
  
  if (!walletAddress) {
    return res.status(401).json({
      success: false,
      message: 'Wallet address required'
    });
  }

  // Simulate user object
  req.user = {
    address: walletAddress,
    isAuthenticated: true
  };

  next();
};

module.exports = auth;