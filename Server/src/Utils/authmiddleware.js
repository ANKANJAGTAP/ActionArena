import jwt from 'jsonwebtoken';
import { secretKey } from '../config/jwtConfig.js'; // Import the secret key

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        
        return res.status(401).json({ message: 'Access denied. No token provided.' });  
    }

    try {
        const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenValue, secretKey);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
