const adminMiddleware = (req, res, next) => {
  try {
    
    if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access denied'
    });
  }
  next();    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in admin verification"
    });
  }
};

module.exports = adminMiddleware;