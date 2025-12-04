import jwt from 'jsonwebtoken';

export const generateTestToken = (
  account: string,
  user: string,
  secretKey = 'test-secret-key',
): string => {
  return jwt.sign({ account, user }, secretKey, { expiresIn: '1h' });
};
