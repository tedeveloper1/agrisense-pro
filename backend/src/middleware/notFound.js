module.exports = function notFound(req, res) {
  res.status(404).json({ error: 'NotFound', message: `Route ${req.method} ${req.originalUrl} not found` });
};
