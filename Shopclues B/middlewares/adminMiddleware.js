const adminMiddleware = (req, res, next) => {
  try {
    console.log('🔐 Admin Middleware - Checking user:', req.user);
    
    if (!req.user) {
      console.log('❌ No user found in request');
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    console.log('👤 User role:', req.user.role);
    
    if (req.user.role !== 'admin') {
      console.log('🚫 Access denied - User is not admin');
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    console.log('✅ Admin access granted for:', req.user.email);
    next();  // FIXED: Call the function!
    
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in admin verification"
    });
  }
};

module.exports = adminMiddleware;