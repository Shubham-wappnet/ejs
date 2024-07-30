export const configuration = () => ({
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  is_development: process.env.NODE_ENV !== 'production',
  jwt_secret: process.env.JWT_SECRET,
});
