module.exports = (err, req, res, next) => {
  console.error(' Error:', err.message);
  res.status(400).json({ error: err.message });
};
