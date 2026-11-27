// Format error sesuai docs/API.md: { "message": "..." }

export function notFound(req, res) {
  res.status(404).json({ message: `Alamat ${req.method} ${req.originalUrl} tidak ditemukan.` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Format JSON tidak valid." });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? "Terjadi kesalahan di server." : err.message,
  });
}
