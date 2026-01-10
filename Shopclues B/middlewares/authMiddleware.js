const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                message: "Access Denied: No token provided" 
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(" ")[1] 
            : authHeader;

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access Denied: Invalid token format" 
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid or expired token" 
            });
        }

        console.log('🔐 Authenticated user:', decoded);
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false,
            message: "Server error in authentication" 
        });
    }
};

module.exports = authMiddleware;