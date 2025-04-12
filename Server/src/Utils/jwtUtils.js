import jwt from 'jsonwebtoken';
import { secretKey } from '../config/jwtConfig.js';

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    city: user.city,
    role: user.role
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1d' });
};
