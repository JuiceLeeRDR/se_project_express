const JWT_SECRET =
  process.env === "development"
    ? "your-super-secret-key"
    : process.env.JWT_SECRET;

module.exports = { JWT_SECRET };
